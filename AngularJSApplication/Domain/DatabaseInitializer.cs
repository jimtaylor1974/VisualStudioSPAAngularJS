using System.Data.Entity;

namespace AngularJSApplication.Domain
{
    // http://www.entityframeworktutorial.net/code-first/database-initialization-strategy-in-code-first.aspx
    public class DatabaseInitializer : CreateDatabaseIfNotExists<AngularJSApplicationDbContext>
    {
        public DatabaseInitializer(AngularJSApplicationDbContext context)
        {
            if (context.Database.Exists() && !context.Database.CompatibleWithModel(false))
            {
                context.Database.Delete();
            }

            if (context.Database.Exists())
            {
                return;
            }

            context.Database.Create();
        }

        protected override void Seed(AngularJSApplicationDbContext context)
        {
            SeedDatabase(context);
        }

        public static void SeedDatabase(AngularJSApplicationDbContext context)
        {
            context.SaveChanges();
        }
    }
}