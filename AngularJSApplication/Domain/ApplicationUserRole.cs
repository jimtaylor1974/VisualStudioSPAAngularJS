namespace AngularJSApplication.Domain
{
    public class ApplicationUserRole
    {
        public virtual string UserId
        {
            get;
            set;
        }
        public virtual string RoleId
        {
            get;
            set;
        }
        public virtual ApplicationRole Role
        {
            get;
            set;
        }
        public virtual ApplicationUser User
        {
            get;
            set;
        }
    }
}