using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace AngularJSApplication.Domain
{
    public class ApplicationUserStore<TUser> : IUserStore<TUser>, IUserLoginStore<TUser>, IUserClaimStore<TUser>, IUserRoleStore<TUser>, IUserPasswordStore<TUser>, IUserSecurityStampStore<TUser> where TUser : ApplicationUser
    {
        private bool _disposed;
        private EntityStore<TUser> _userStore;
        private EntityStore<ApplicationRole> _roleStore;
        private IDbSet<ApplicationUserRole> _userRoles;
        private IDbSet<ApplicationUserClaim> _userClaims;
        private IDbSet<ApplicationUserLogin> _logins;
        public DbContext Context
        {
            get;
            private set;
        }

        public bool DisposeContext
        {
            get;
            set;
        }

        public bool AutoSaveChanges
        {
            get;
            set;
        }

        public ApplicationUserStore()
            : this(new AngularJSApplicationDbContext())
        {
            this.DisposeContext = true;
        }

        /// <summary>Constructor that takes the db context</summary>
        public ApplicationUserStore(DbContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }
            this.Context = context;
            this.AutoSaveChanges = true;
            this._userStore = new EntityStore<TUser>(context);
            this._roleStore = new EntityStore<ApplicationRole>(context);
            this._logins = context.Set<ApplicationUserLogin>();
            this._userClaims = context.Set<ApplicationUserClaim>();
            this._userRoles = context.Set<ApplicationUserRole>();
        }
        private async Task SaveChanges()
        {
            if (this.AutoSaveChanges)
            {
                await this.Context.SaveChangesAsync();
            }
        }
        public virtual Task<TUser> FindByIdAsync(string userId)
        {
            this.ThrowIfDisposed();
            return this._userStore.GetByIdAsync(userId);
        }
        public virtual Task<TUser> FindByNameAsync(string userName)
        {
            this.ThrowIfDisposed();
            IQueryable<TUser> source =
                from u in this._userStore.EntitySet
                where u.UserName.ToUpper() == userName.ToUpper()
                select u;
            return Task.FromResult<TUser>(source.FirstOrDefault<TUser>());
        }
        public virtual async Task CreateAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            this._userStore.Create(user);
            await this.SaveChanges();
        }
        public virtual Task DeleteAsync(TUser user)
        {
            throw new NotSupportedException();
        }
        public virtual async Task UpdateAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            await this.SaveChanges();
        }
        private void ThrowIfDisposed()
        {
            if (this._disposed)
            {
                throw new ObjectDisposedException(base.GetType().Name);
            }
        }
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (this.DisposeContext && disposing && this.Context != null)
            {
                this.Context.Dispose();
            }
            this._disposed = true;
            this.Context = null;
            this._userStore = null;
        }
        public virtual async Task<TUser> FindAsync(UserLoginInfo login)
        {
            this.ThrowIfDisposed();
            if (login == null)
            {
                throw new ArgumentNullException("login");
            }
            ApplicationUser identityUser = await (from l in this._logins
                where l.LoginProvider == login.LoginProvider && l.ProviderKey == login.ProviderKey
                select l.User).FirstOrDefaultAsync();
            return identityUser as TUser;
        }
        public virtual Task AddLoginAsync(TUser user, UserLoginInfo login)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (login == null)
            {
                throw new ArgumentNullException("login");
            }
            user.Logins.Add(new ApplicationUserLogin
            {
                User = user,
                ProviderKey = login.ProviderKey,
                LoginProvider = login.LoginProvider
            });
            return Task.FromResult<int>(0);
        }
        public virtual Task RemoveLoginAsync(TUser user, UserLoginInfo login)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (login == null)
            {
                throw new ArgumentNullException("login");
            }
            ApplicationUserLogin identityUserLogin = (
                from l in user.Logins
                where l.LoginProvider == login.LoginProvider && l.User == user && l.ProviderKey == login.ProviderKey
                select l).SingleOrDefault<ApplicationUserLogin>();
            if (identityUserLogin != null)
            {
                user.Logins.Remove(identityUserLogin);
                this._logins.Remove(identityUserLogin);
            }
            return Task.FromResult<int>(0);
        }
        public virtual Task<IList<UserLoginInfo>> GetLoginsAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            IList<UserLoginInfo> list = new List<UserLoginInfo>();
            foreach (ApplicationUserLogin current in user.Logins)
            {
                list.Add(new UserLoginInfo(current.LoginProvider, current.ProviderKey));
            }
            return Task.FromResult<IList<UserLoginInfo>>(list);
        }
        public virtual Task<IList<Claim>> GetClaimsAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            IList<Claim> list = new List<Claim>();
            foreach (ApplicationUserClaim current in user.Claims)
            {
                list.Add(new Claim(current.ClaimType, current.ClaimValue));
            }
            return Task.FromResult<IList<Claim>>(list);
        }
        public virtual Task AddClaimAsync(TUser user, Claim claim)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (claim == null)
            {
                throw new ArgumentNullException("claim");
            }
            user.Claims.Add(new ApplicationUserClaim
            {
                User = user,
                ClaimType = claim.Type,
                ClaimValue = claim.Value
            });
            return Task.FromResult<int>(0);
        }
        public virtual Task RemoveClaimAsync(TUser user, Claim claim)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (claim == null)
            {
                throw new ArgumentNullException("claim");
            }
            List<ApplicationUserClaim> list = (
                from uc in user.Claims
                where uc.ClaimValue == claim.Value && uc.ClaimType == claim.Type
                select uc).ToList<ApplicationUserClaim>();
            foreach (ApplicationUserClaim current in list)
            {
                user.Claims.Remove(current);
                this._userClaims.Remove(current);
            }
            return Task.FromResult<int>(0);
        }
        public virtual Task AddToRoleAsync(TUser user, string role)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (string.IsNullOrWhiteSpace(role))
            {
                throw new ArgumentException(Resources.ValueCannotBeNullOrEmpty, "role");
            }
            ApplicationRole identityRole = this._roleStore.DbEntitySet.SingleOrDefault((ApplicationRole r) => r.Name.ToUpper() == role.ToUpper());
            if (identityRole == null)
            {
                throw new InvalidOperationException(string.Format(CultureInfo.CurrentCulture, Resources.RoleNotFound, new object[]
				{
					role
				}));
            }
            user.Roles.Add(new ApplicationUserRole
            {
                User = user,
                Role = identityRole
            });
            return Task.FromResult<int>(0);
        }
        public virtual Task RemoveFromRoleAsync(TUser user, string role)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (string.IsNullOrWhiteSpace(role))
            {
                throw new ArgumentException(Resources.ValueCannotBeNullOrEmpty, "role");
            }
            ApplicationUserRole identityUserRole = (
                from r in user.Roles
                where r.Role.Name.ToUpper() == role.ToUpper()
                select r).FirstOrDefault<ApplicationUserRole>();
            if (identityUserRole != null)
            {
                user.Roles.Remove(identityUserRole);
                this._userRoles.Remove(identityUserRole);
            }
            return Task.FromResult<int>(0);
        }
        public virtual Task<IList<string>> GetRolesAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            List<string> result = (
                from u in user.Roles
                select u.Role.Name).ToList<string>();
            return Task.FromResult<IList<string>>(result);
        }
        public virtual Task<bool> IsInRoleAsync(TUser user, string role)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            if (string.IsNullOrWhiteSpace(role))
            {
                throw new ArgumentException(Resources.ValueCannotBeNullOrEmpty, "role");
            }
            return Task.FromResult<bool>(user.Roles.Any((ApplicationUserRole r) => r.Role.Name.ToUpper() == role.ToUpper()));
        }
        public Task SetPasswordHashAsync(TUser user, string passwordHash)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            user.PasswordHash = passwordHash;
            return Task.FromResult<int>(0);
        }
        public Task<string> GetPasswordHashAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            return Task.FromResult<string>(user.PasswordHash);
        }
        public Task SetSecurityStampAsync(TUser user, string stamp)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            user.SecurityStamp = stamp;
            return Task.FromResult<int>(0);
        }
        public Task<string> GetSecurityStampAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            return Task.FromResult<string>(user.SecurityStamp);
        }
        public Task<bool> HasPasswordAsync(TUser user)
        {
            return Task.FromResult<bool>(user.PasswordHash != null);
        }
    }
}