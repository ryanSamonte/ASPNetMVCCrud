using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CRUDAspEntity.Startup))]
namespace CRUDAspEntity
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
