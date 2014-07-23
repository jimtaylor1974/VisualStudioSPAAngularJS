namespace AngularJSApplication.Domain
{
    public class ApplicationUserLogin
    {
        public virtual string LoginProvider
        {
            get;
            set;
        }
        public virtual string ProviderKey
        {
            get;
            set;
        }
        public virtual string UserId
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