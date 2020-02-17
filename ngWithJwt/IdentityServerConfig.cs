using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Models;

namespace ngWithJwt
{
    public class IdentityServerConfig
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
                new IdentityResource("roles", new List<string> { "role" })
            };
        }

        // Api resources.
        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("ShopApi") {
                    UserClaims = { "role" }
                }
            };
        }

        // Clients want to access resources.
        public static IEnumerable<Client> GetClients()
        {
            // Clients credentials.
            return new List<Client>
            {
                new Client
                {
                    ClientId = "ShopSPA",
                    ClientName = "Yamaha MotorShop SPA",
                    ClientUri = Startup.StaticConfig["JwtIssuer"],
                    AllowedGrantTypes =
                    {
                        GrantType.ResourceOwnerPassword, // Resource Owner Password Credential grant.
                        "refresh_token"
                    },
                    AllowAccessTokensViaBrowser = true,
                    RequireClientSecret = false, // This client does not need a secret to request tokens from the token endpoint.

                    AccessTokenLifetime = int.Parse(Startup.StaticConfig["TokenLifeTime"]), // Lifetime of access token in seconds.

                    AllowedScopes = {
                        IdentityServerConstants.StandardScopes.OpenId, // For UserInfo endpoint.
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.Email,
                        IdentityServerConstants.StandardScopes.OfflineAccess,
                        "roles",
                        "ShopApi"
                    },
                    AllowOfflineAccess = true, // For refresh token.
                    RefreshTokenUsage = TokenUsage.OneTimeOnly,
                    AbsoluteRefreshTokenLifetime = int.Parse(Startup.StaticConfig["AbsoluteRefreshTokenLifeTime"]),
                    SlidingRefreshTokenLifetime = int.Parse(Startup.StaticConfig["RefreshTokenLifeTime"]),
                    RefreshTokenExpiration = TokenExpiration.Sliding,
                    UpdateAccessTokenClaimsOnRefresh = true,
                    RedirectUris = new List<string> {"https://localhost:44373/signin-oidc"},
                    PostLogoutRedirectUris = new List<string> { "https://localhost:44373" }
                }
            };
        }
    }
}
