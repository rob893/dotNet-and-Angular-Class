using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;


        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            this.repo = repo; 
            this.mapper = mapper;   
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            int currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            User userFromRepo = await repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            PagedList<User> users = await repo.GetUsers(userParams);

            IEnumerable<UserForListDto> usersToReturn = mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            User user = await repo.GetUser(id);

            var userToReturn = mapper.Map<UserForDetailsDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            User userFromRepo = await repo.GetUser(id);

            mapper.Map(userForUpdateDto, userFromRepo);

            if (await repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{userId}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            if (userId == recipientId)
            {
                return BadRequest("You cannot like yourself!");
            }

            Like like = await repo.GetLike(userId, recipientId);

            if (like != null)
            {
                return BadRequest("You already like this person!");
            }

            if (await repo.GetUser(recipientId) == null)
            {
                return NotFound();
            }

            like = new Like
            {
                LikerId = userId,
                LikeeId = recipientId
            };

            repo.Add<Like>(like);

            if (await repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Failed to like user.");
        }
    }
}