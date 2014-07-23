namespace AngularJSApplication.Domain
{
    public class ApplicationUserClaim
    {
        public virtual int Id
        {
            get;
            set;
        }
        public virtual string ClaimType
        {
            get;
            set;
        }
        public virtual string ClaimValue
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