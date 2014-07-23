using System.Configuration;

namespace AngularJSApplication.Infrastructure.Authentication
{
    public static class FacebookAccount
    {
        public static string AppId
        {
            get
            {
                return ConfigurationManager.AppSettings["FacebookAuthenticationAppId"];
            }
        }

        public static string AppSecret
        {
            get
            {
                return ConfigurationManager.AppSettings["FacebookAuthenticationAppSecret"];
            }
        }

        public static bool IsConfigured
        {
            get { return !string.IsNullOrEmpty(AppId) && !string.IsNullOrEmpty(AppSecret); }
        }
    }
}