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
    public class LoginTests
    {
        private IWebDriver driver;

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
        }

        [Test]
        public void Login()
        {
            driver.Navigate().GoToUrl("http://localhost:5173/login");

            driver.FindElement(By.Id("username")).SendKeys("Rijadi");
            driver.FindElement(By.Id("password")).SendKeys("Rijadi#123");
            driver.FindElement(By.CssSelector("button[type='submit']")).Click();

            Assert.IsTrue(driver.Url.Contains("/dashboard") || driver.PageSource.Contains("Welcome"));
        }

        [TearDown]
        public void TearDown()
        {
            driver.Quit();
            driver.Dispose();
        }

    }
}
