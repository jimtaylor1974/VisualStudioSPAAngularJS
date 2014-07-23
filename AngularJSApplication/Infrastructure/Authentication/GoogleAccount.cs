using System.Configuration;

namespace AngularJSApplication.Infrastructure.Authentication
{
    public static class GoogleAccount
    {
        public static string ClientId
        {
            get
            {
                return ConfigurationManager.AppSettings["GoogleAuthenticationClientId"];
            }
        }

        public static string ClientSecret
        {
            get
            {
                return ConfigurationManager.AppSettings["GoogleAuthenticationClientSecret"];
            }
        }

        public static bool IsConfigured
        {
            get { return !string.IsNullOrEmpty(ClientId) && !string.IsNullOrEmpty(ClientSecret); }
        }
    }
}