using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {

        private readonly IDatingRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private readonly Cloudinary cloudinary;


        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.repo = repo;
            this.mapper = mapper;
            this.cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                this.cloudinaryConfig.Value.CloudName,
                this.cloudinaryConfig.Value.ApiKey,
                this.cloudinaryConfig.Value.ApiSecret
            );

            cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            Photo photoFromRepo = await repo.GetPhoto(id);

            var photo = mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            User userFromRepo = await repo.GetUser(userId);

            IFormFile file = photoForCreationDto.File;

            ImageUploadResult uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (Stream stream = file.OpenReadStream())
                {
                    ImageUploadParams uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            Photo photo = mapper.Map<Photo>(photoForCreationDto);

            if (!userFromRepo.Photos.Any(u => u.IsMain))
            {
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);

            if (await repo.SaveAll())
            {
                PhotoForReturnDto photoToReturn = mapper.Map<PhotoForReturnDto>(photo);

                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo!");
        }

        [HttpPost("{photoId}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int photoId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            User userFromRepo = await repo.GetUser(userId);

            if (!userFromRepo.Photos.Any(p => p.Id == photoId))
            {
                return Unauthorized();
            }

            Photo photoFromRepo = await repo.GetPhoto(photoId);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("This is already the main photo!");
            }

            Photo currentMainPhoto = await repo.GetMainPhotoForUser(userId);

            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await repo.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Could not set photo to main!");
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePhoto(int userId, int photoId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            User userFromRepo = await repo.GetUser(userId);

            if (!userFromRepo.Photos.Any(p => p.Id == photoId))
            {
                return Unauthorized();
            }

            Photo photoFromRepo = await repo.GetPhoto(photoId);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("You cannot delete your main photo!");
            }

            if (photoFromRepo.PublicId != null)
            {
                DeletionParams deleteParams = new DeletionParams(photoFromRepo.PublicId);
                DeletionResult result = cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    repo.Delete(photoFromRepo);
                }
            }

            if (photoFromRepo.PublicId == null)
            {
                repo.Delete(photoFromRepo);
            }

            if (await repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Failed to delete the photo.");
        }
    }
}