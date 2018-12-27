namespace CRUDAspEntity.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddGradeColumnIntoPersonalInfoEntity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PersonalInfoes", "Grade", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PersonalInfoes", "Grade");
        }
    }
}
