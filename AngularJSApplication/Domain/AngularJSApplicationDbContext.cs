using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.Validation;
using System.Globalization;

namespace AngularJSApplication.Domain
{
    public class AngularJSApplicationDbContext : DbContext
    {
        public virtual IDbSet<ApplicationUser> Users { get; set; }
        public virtual IDbSet<ApplicationRole> Roles { get; set; }

        public AngularJSApplicationDbContext()
            : base("DefaultConnection")
        {
            Database.SetInitializer(new DatabaseInitializer(this));
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            if (modelBuilder == null)
            {
                throw new ArgumentNullException("modelBuilder");
            }

            /* Authentication specific code */

            modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");

            EntityTypeConfiguration<ApplicationUser> userConfiguration = modelBuilder.Entity<ApplicationUser>().ToTable("AspNetUsers");
            userConfiguration.Property(u => u.UserName).IsRequired();
            modelBuilder.Entity<ApplicationUser>().HasMany<ApplicationUserRole>(u => u.Roles);
            modelBuilder.Entity<ApplicationUserRole>().HasKey(r => new
            {
                r.UserId,
                r.RoleId
            }).ToTable("AspNetUserRoles");

            EntityTypeConfiguration<ApplicationUserLogin> userLoginConfiguration = modelBuilder.Entity<ApplicationUserLogin>().HasKey(l => new
            {
                l.UserId,
                l.LoginProvider,
                l.ProviderKey
            }).ToTable("AspNetUserLogins");
            userLoginConfiguration.HasRequired(u => u.User);

            EntityTypeConfiguration<ApplicationUserClaim> userClaimConfiguration = modelBuilder.Entity<ApplicationUserClaim>().ToTable("AspNetUserClaims");
            userClaimConfiguration.HasRequired(u => u.User);

            EntityTypeConfiguration<ApplicationRole> roleConfiguration = modelBuilder.Entity<ApplicationRole>().ToTable("AspNetRoles");
            roleConfiguration.Property(r => r.Name).IsRequired();

            /* / Authentication specific code */
        }

        protected override DbEntityValidationResult ValidateEntity(DbEntityEntry entityEntry, IDictionary<object, object> items)
        {
            if (entityEntry != null && entityEntry.State == EntityState.Added)
            {
                var user = entityEntry.Entity as ApplicationUser;
                if (user != null)
                {
                    if (this.Users.Any(u => string.Equals(u.UserName, user.UserName)))
                        return new DbEntityValidationResult(entityEntry, new List<DbValidationError>())
                        {
                            ValidationErrors = {
                                new DbValidationError("User", string.Format(CultureInfo.CurrentCulture, Resources.DuplicateUserName, new object[1]
                                {
                                  user.UserName
                                }))
                              }
                        };
                }

                var role = entityEntry.Entity as ApplicationRole;
                if (role != null)
                {
                    if (this.Roles.Any(r => string.Equals(r.Name, role.Name)))
                        return new DbEntityValidationResult(entityEntry, new List<DbValidationError>())
                        {
                            ValidationErrors = {
                                new DbValidationError("Role", string.Format(CultureInfo.CurrentCulture, Resources.RoleAlreadyExists, new object[1]
                                {
                                  role.Name
                                }))
                              }
                        };
                }
            }

            return base.ValidateEntity(entityEntry, items);
        }
    }
}