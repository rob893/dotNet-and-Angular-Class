using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private DataContext context;


        public DatingRepository(DataContext context)
        {
            this.context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            User user = await context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            IQueryable<User> usersQuery =  context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive);

            usersQuery = usersQuery.Where(u => u.Id != userParams.UserId);
            usersQuery = usersQuery.Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                IEnumerable<int> userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                usersQuery = usersQuery.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                IEnumerable<int> userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                usersQuery = usersQuery.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                DateTime minDoB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                DateTime maxDoB = DateTime.Today.AddYears(-userParams.MinAge);

                usersQuery = usersQuery.Where(u => u.DateOfBirth >= minDoB && u.DateOfBirth <= maxDoB);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        usersQuery = usersQuery.OrderByDescending(u => u.Created);
                        break;
                    default:
                        usersQuery = usersQuery.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(usersQuery, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int userId, bool likers)
        {
            User user = await context.Users.Include(x => x.Likers).Include(x => x.Likees).FirstOrDefaultAsync(u => u.Id == userId);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == userId).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == userId).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            Photo photo = await context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            Photo mainPhoto = await context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);

            return mainPhoto;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }
    }
}