using System.Configuration;

namespace AngularJSApplication.Infrastructure.Authentication
{
    public static class TwitterAccount
    {
        public static string ConsumerKey
        {
            get
            {
                return ConfigurationManager.AppSettings["TwitterAuthenticationConsumerKey"];
            }
        }

        public static string ConsumerSecret
        {
            get
            {
                return ConfigurationManager.AppSettings["TwitterAuthenticationConsumerSecret"];
            }
        }

        public static bool IsConfigured
        {
            get { return !string.IsNullOrEmpty(ConsumerKey) && !string.IsNullOrEmpty(ConsumerSecret); }
        }
    }
}