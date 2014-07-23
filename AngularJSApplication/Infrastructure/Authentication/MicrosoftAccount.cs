using System.Configuration;

namespace AngularJSApplication.Infrastructure.Authentication
{
    public static class MicrosoftAccount
    {
        public static string ClientId
        {
            get
            {
                return ConfigurationManager.AppSettings["MicrosoftAccountAuthenticationClientId"];
            }
        }

        public static string ClientSecret
        {
            get
            {
                return ConfigurationManager.AppSettings["MicrosoftAccountAuthenticationClientSecret"];
            }
        }

        public static bool IsConfigured
        {
            get { return !string.IsNullOrEmpty(ClientId) && !string.IsNullOrEmpty(ClientSecret); }
        }
    }
}