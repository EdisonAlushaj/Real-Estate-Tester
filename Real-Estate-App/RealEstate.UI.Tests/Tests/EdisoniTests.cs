using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium.Chrome;

namespace RealEstate.UI.Tests.Tests
{
    public class EdisoniTests
    {
        private IWebDriver driver;
        private WebDriverWait wait;
        private string baseUrl = "http://localhost:5173"; 

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(20));

            LoginAsAgent("Edison", "Edison@123");
        }

        private void LoginAsAgent(string username, string password)
        {
            driver.Navigate().GoToUrl(baseUrl + "/login");
            try
            {
                wait.Until(d => d.FindElement(By.Id("username"))).SendKeys(username);
                driver.FindElement(By.Id("password")).SendKeys(password);
                driver.FindElement(By.CssSelector("button[type='submit']")).Click();
                wait.Until(d => d.Url.Contains("/dashboard") || d.PageSource.Contains("Welcome") || d.FindElement(By.Id("emri")) != null);
            }
            catch (Exception ex)
            {
                Assert.Fail($"Login failed for user {username}. Error: {ex.Message}");
            }
        }

        [Test, Order(1)] 
        public void AddApartment_ValidData_ByAgent()
        {
            driver.Navigate().GoToUrl(baseUrl + "/dashboard");

            try
            {
                wait.Until(d => d.FindElement(By.Id("emri")).Displayed);
            }
            catch (WebDriverTimeoutException)
            {
                Assert.Fail("Forma e shtimit të apartamentit nuk u ngarkua ose fusha 'emri' nuk u gjet.");
            }

            string apartmentName = "Apartamenti Test Nga Edison " + DateTime.Now.Ticks;
            driver.FindElement(By.Id("emri")).SendKeys(apartmentName);
            driver.FindElement(By.Id("adresa")).SendKeys("Rruga Kodra e Diellit, Prishtinë");
            driver.FindElement(By.Id("price")).SendKeys("115000");
            driver.FindElement(By.Id("description")).SendKeys("Apartament testues i shtuar nga Edison përmes Selenium.");

            driver.FindElement(By.Id("type")).SendKeys("apartament");

            string tempImageFolder = Path.Combine(Path.GetTempPath(), "RealEstateTestImages");
            Directory.CreateDirectory(tempImageFolder);

            string testImagePath = Path.Combine(tempImageFolder, "test_apartment_" + Guid.NewGuid().ToString() + ".png");
            File.WriteAllBytes(testImagePath, new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }); 

            IWebElement photoInput = driver.FindElement(By.Id("photo"));
            photoInput.SendKeys(testImagePath);

            driver.FindElement(By.Id("floor")).SendKeys("5");
            driver.FindElement(By.Id("nrDhomave")).SendKeys("3");

            IWebElement kaAnshensorCheckbox = driver.FindElement(By.Id("kaAnshensor")); 
            if (!kaAnshensorCheckbox.Selected)
            {
                kaAnshensorCheckbox.Click();
            }

            driver.FindElement(By.Id("submitBtn")).Click();

            bool apartmentListedSuccessfully;
            try
            {
                apartmentListedSuccessfully = wait.Until(d => d.PageSource.Contains(apartmentName));
            }
            catch (WebDriverTimeoutException)
            {
                apartmentListedSuccessfully = false;
            }

            if (!apartmentListedSuccessfully)
            {
                driver.Navigate().Refresh();
                try
                {
                    wait.Until(d => d.FindElement(By.TagName("body")).Text.Contains(apartmentName));
                    apartmentListedSuccessfully = driver.PageSource.Contains(apartmentName);
                }
                catch (WebDriverTimeoutException)
                {
                    apartmentListedSuccessfully = false;
                }
            }

            if (File.Exists(testImagePath))
            {
                File.Delete(testImagePath);
            }

            Assert.IsTrue(apartmentListedSuccessfully, $"Apartamenti i sapo krijuar '{apartmentName}' nuk u gjet në faqe pas shtimit.");
        }

        [TearDown]
        public void TearDown()
        {
            if (driver != null)
            {
                driver.Quit();
                driver.Dispose();
            }
        }
    }
}
