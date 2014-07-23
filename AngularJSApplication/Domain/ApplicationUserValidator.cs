using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace AngularJSApplication.Domain
{
    public class ApplicationUserValidator : IIdentityValidator<ApplicationUser>
    {
        private UserManager<ApplicationUser> Manager { get; set; }

        public ApplicationUserValidator(UserManager<ApplicationUser> manager)
        {
            if (manager == null)
            {
                throw new ArgumentNullException("manager");
            }

            this.Manager = manager;
        }

        private async Task ValidateUserName(ApplicationUser user, List<string> errors)
        {
            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                errors.Add(Resources.NameTooShort);
            }
            /*else if (!IsValidEmail(user.UserName))
            {
                errors.Add(string.Format(CultureInfo.CurrentCulture, Resources.InvalidUserName, user.UserName));
            }*/
            else
            {
                ApplicationUser owner = await this.Manager.FindByNameAsync(user.UserName);
                if (owner != null && owner.Id != user.Id)
                {
                    errors.Add(string.Format(CultureInfo.CurrentCulture, Resources.DuplicateName, user.UserName));
                }
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var address = new MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IdentityResult> ValidateAsync(ApplicationUser item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("entity");
            }

            var errors = new List<string>();
            await this.ValidateUserName(item, errors);
            return errors.Count <= 0 ? IdentityResult.Success : IdentityResult.Failed(errors.ToArray());
        }
    }
}