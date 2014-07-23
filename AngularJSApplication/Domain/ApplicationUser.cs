using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

namespace AngularJSApplication.Domain
{
    public class ApplicationUser : IUser
    {
        public ApplicationUser()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Claims = new List<ApplicationUserClaim>();
            this.Roles = new List<ApplicationUserRole>();
            this.Logins = new List<ApplicationUserLogin>();
        }

        public ApplicationUser(string userName)
            : this()
        {
            this.UserName = userName;
        }

        public virtual string Id { get; set; }

        [Required]
        public virtual string UserName { get; set; }

        public virtual string PasswordHash { get; set; }

        public virtual string SecurityStamp { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }

        public string PhoneNumber { get; set; }

        public bool PhoneNumberConfirmed { get; set; }

        public bool TwoFactorEnabled { get; set; }

        public DateTime? LockoutEndDateUtc { get; set; }

        public bool LockoutEnabled { get; set; }

        public int AccessFailedCount { get; set; }

        [JsonIgnore]
        public virtual ICollection<ApplicationUserRole> Roles { get; private set; }

        [JsonIgnore]
        public virtual ICollection<ApplicationUserClaim> Claims { get; private set; }

        [JsonIgnore]
        public virtual ICollection<ApplicationUserLogin> Logins { get; private set; }
    }
}