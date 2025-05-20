using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace RealEstate.UI.Tests.Tests
{
    public class RijadiTests
    {
        private IWebDriver driver;

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
        }

        [Test, Order(1)]
        public void Login()
        {
            driver.Navigate().GoToUrl("http://localhost:5173/login");

            driver.FindElement(By.Id("username")).SendKeys("Edison");
            driver.FindElement(By.Id("password")).SendKeys("Edison@123");
            driver.FindElement(By.CssSelector("button[type='submit']")).Click();

            Assert.IsTrue(driver.Url.Contains("/dashboard") || driver.PageSource.Contains("Welcome"));
        }

        [Test, Order(2)]
        public void CreateApartment()
        {
            driver.Navigate().GoToUrl("http://localhost:5173/dashboard");

            driver.FindElement(By.Id("emri")).SendKeys("Test Apartament");
            driver.FindElement(By.Id("adresa")).SendKeys("Rruga e Dibrës");
            driver.FindElement(By.Id("price")).SendKeys("75000");
            driver.FindElement(By.Id("description")).SendKeys("Apartament testues");
            driver.FindElement(By.Id("type")).SendKeys("apartament");
            driver.FindElement(By.Id("photo")).SendKeys("https://via.placeholder.com/150");
            driver.FindElement(By.Id("floor")).SendKeys("3");
            driver.FindElement(By.Id("nrDhomave")).SendKeys("2");
            driver.FindElement(By.Id("kaAnshensor")).Click();

            driver.FindElement(By.Id("submitBtn")).Click();

            Thread.Sleep(2000);
            Assert.IsTrue(driver.PageSource.Contains("Test Apartament"));
        }

        [TearDown]
        public void TearDown()
        {
            driver.Quit();
            driver.Dispose();
        }

    }
}
