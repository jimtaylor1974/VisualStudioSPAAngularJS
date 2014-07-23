using System;
using Microsoft.AspNet.Identity;

namespace AngularJSApplication.Domain
{
    public class ApplicationRole : IRole
    {
        public string Id
        {
            get;
            set;
        }
        public string Name
        {
            get;
            set;
        }
        public ApplicationRole()
            : this("")
        {
        }
        public ApplicationRole(string roleName)
        {
            this.Id = Guid.NewGuid().ToString();
            this.Name = roleName;
        }
    }
}