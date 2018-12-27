using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRUDAspEntity.Models;
using Newtonsoft.Json;
using System.Data.Entity;

namespace CRUDAspEntity.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ViewAll()
        {
            var all = _context.PersonalInfos.ToList();


            return Json(all, JsonRequestBehavior.AllowGet);
        }

        [ValidateAntiForgeryToken]
        public EmptyResult Save(PersonalInfo personalInfo)
        {
            _context.PersonalInfos.Add(personalInfo);

            _context.SaveChanges();

            return new EmptyResult();
        }

        public ActionResult Edit(int Id)
        {
            var result = _context.PersonalInfos.Where(s => s.Id == Id).FirstOrDefault();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Update(PersonalInfo personalInfo, int Id)
        {
            var studentData = _context.PersonalInfos.Where(s => s.Id == Id).FirstOrDefault();

            if (studentData != null)
            {
                studentData.LastName = personalInfo.LastName;
                studentData.FirstName = personalInfo.FirstName;
                studentData.Age = personalInfo.Age;

                _context.Entry(studentData).State = EntityState.Modified;
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        public ActionResult Delete(int Id)
        {
            var studentData = _context.PersonalInfos.Where(s => s.Id == Id).FirstOrDefault();

            if (studentData != null)
            {
                _context.Entry(studentData).State = EntityState.Deleted;
                _context.SaveChanges();
            }

            return View("Index");
        }

        public ActionResult GetAllGrades()
        {
            var grades = _context.PersonalInfos.Select(g => g.Grade).ToList();

            return Json(grades, JsonRequestBehavior.AllowGet);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}