using System;
using System.Threading.Tasks;
using AngularJSApplication.Domain;
using AngularJSApplication.Infrastructure.Authentication;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.MicrosoftAccount;
using Microsoft.Owin.Security.OAuth;
using Owin;
using AngularJSApplication.Providers;

namespace AngularJSApplication
{
    public partial class Startup
    {
        static Startup()
        {
            PublicClientId = "self";

            UserManagerFactory = () =>
            {
                var userManager = new UserManager<ApplicationUser>(new ApplicationUserStore<ApplicationUser>());

                userManager.UserValidator = new ApplicationUserValidator(userManager);

                return userManager;
            };

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId, UserManagerFactory),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            };
        }

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static Func<UserManager<ApplicationUser>> UserManagerFactory { get; set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            if (MicrosoftAccount.IsConfigured)
            {
                var options = new MicrosoftAccountAuthenticationOptions
                {
                    ClientId = MicrosoftAccount.ClientId,
                    ClientSecret = MicrosoftAccount.ClientSecret,
                    Provider = new MicrosoftAccountAuthenticationProvider
                    {
                        OnAuthenticated = context => Task.FromResult(0)
                    }
                };

                options.Scope.Add("wl.basic");
                options.Scope.Add("wl.emails");

                app.UseMicrosoftAccountAuthentication(options);
            }

            if (TwitterAccount.IsConfigured)
            {
                // https://apps.twitter.com/
                app.UseTwitterAuthentication(
                    TwitterAccount.ConsumerKey,
                    TwitterAccount.ConsumerSecret);
            }

            if (FacebookAccount.IsConfigured)
            {
                app.UseFacebookAuthentication(
                   FacebookAccount.AppId,
                   FacebookAccount.AppSecret);               
            }

            if (GoogleAccount.IsConfigured)
            {
                // https://console.developers.google.com
                app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions
                {
                    ClientId = GoogleAccount.ClientId,
                    ClientSecret = GoogleAccount.ClientSecret
                });
            }
        }
    }
}
