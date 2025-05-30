using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.IO;
using System.Threading;

namespace RealEstate.UI.Tests.Tests
{
    public class EdisoniTests
    {
        private IWebDriver driver;
        private WebDriverWait wait;
        private string baseUrl = "http://localhost:5173";

        private static int propertyIdForRent = -1;
        private static string propertyNameForRent = "";

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(45));
        }

        [Test, Order(1)]
        public void LoginAsAgent_ForInitialOperations()
        {
            Console.WriteLine("DEBUG: Testi LoginAsAgent_ForInitialOperations po fillon.");

            driver.Navigate().GoToUrl(baseUrl + "/login");
            Console.WriteLine($"DEBUG: Naviguar te {baseUrl}/login");
            try
            {
                wait.Until(d => d.FindElement(By.Id("username")).Displayed);
                driver.FindElement(By.Id("username")).SendKeys("Edison");
                driver.FindElement(By.Id("password")).SendKeys("Edison@123");
                driver.FindElement(By.CssSelector("button[type='submit']")).Click();
                Console.WriteLine("DEBUG: Klikuar butoni submit për login.");

                bool isLoggedIn = false;
                try
                {
                    isLoggedIn = wait.Until(d =>
                        d.Url.Contains("/dashboard") ||
                        d.PageSource.Contains("Welcome") ||
                        (d.FindElements(By.Id("emri")).Count > 0 && d.FindElement(By.Id("emri")).Displayed)
                    );
                }
                catch (WebDriverTimeoutException ex)
                {
                    Console.WriteLine($"DEBUG: Timeout gjatë pritjes për konfirmimin e login-it: {ex.Message}");
                    isLoggedIn = false;
                }
                Assert.IsTrue(isLoggedIn, "Login si Agjent dështoi ose ridrejtimi në dashboard nuk ndodhi.");
                Console.WriteLine("DEBUG: Login si Agjent u krye me sukses.");
            }
            catch (Exception ex)
            {
                Assert.Fail($"Login si Agjent për veprimet fillestare dështoi. Gabimi: {ex.Message}. URL aktuale: {driver.Url}");
            }
        }

        [Test, Order(2)]
        public void CreateApartment_ForRent_ByAgent()
        {
            Console.WriteLine("DEBUG: Testi CreateApartment_ForRent_ByAgent po fillon.");
            driver.Navigate().GoToUrl(baseUrl + "/dashboard");

            try
            {
                wait.Until(d => d.FindElement(By.Id("emri")).Displayed);
            }
            catch (WebDriverTimeoutException)
            {
                Assert.Fail("Forma e shtimit të apartamentit nuk u ngarkua pas navigimit në dashboard.");
            }

            propertyNameForRent = "Apartament Qira Test Selenium " + DateTime.Now.Ticks;
            driver.FindElement(By.Id("emri")).SendKeys(propertyNameForRent);
            driver.FindElement(By.Id("adresa")).SendKeys("Rruga Test Qiraje, Prishtinë");
            driver.FindElement(By.Id("price")).SendKeys("450");
            driver.FindElement(By.Id("description")).SendKeys("Apartament testues për qira i krijuar nga Selenium.");
            driver.FindElement(By.Id("type")).SendKeys("Rent");

            string tempImageFolder = Path.Combine(Path.GetTempPath(), "RealEstateTestImagesRent");
            Directory.CreateDirectory(tempImageFolder);
            string testImagePath = Path.Combine(tempImageFolder, "test_rent_apt_" + Guid.NewGuid().ToString("N") + ".png");
            File.WriteAllBytes(testImagePath, new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 });

            IWebElement photoInput = driver.FindElement(By.Id("photo"));
            photoInput.SendKeys(testImagePath);

            driver.FindElement(By.Id("floor")).SendKeys("3");
            driver.FindElement(By.Id("nrDhomave")).SendKeys("2");
            driver.FindElement(By.Id("kaAnshensor")).Click();
            driver.FindElement(By.Id("submitBtn")).Click();
            Console.WriteLine("DEBUG: Forma e shtimit të apartamentit u dërgua.");

            bool apartmentListed = false;
            try
            {
                wait.Until(d => d.FindElement(By.XPath($"//*[self::h3 or self::p or self::span][contains(text(), '{propertyNameForRent}')]")).Displayed);
                apartmentListed = true;
            }
            catch (WebDriverTimeoutException)
            {
                Console.WriteLine($"DEBUG: Timeout gjatë pritjes që apartamenti '{propertyNameForRent}' të listohet. Provohet freskimi.");
                driver.Navigate().Refresh();
                Thread.Sleep(2000);
                try
                {
                    wait.Until(d => d.FindElement(By.XPath($"//*[self::h3 or self::p or self::span][contains(text(), '{propertyNameForRent}')]")).Displayed);
                    apartmentListed = true;
                }
                catch (WebDriverTimeoutException exRefresh)
                {
                    Console.WriteLine($"DEBUG: Timeout edhe pas freskimit: {exRefresh.Message}");
                    apartmentListed = false;
                }
            }

            if (File.Exists(testImagePath)) File.Delete(testImagePath);
            Assert.IsTrue(apartmentListed, $"Apartamenti për qira '{propertyNameForRent}' nuk u gjet pas krijimit dhe freskimit.");
            Console.WriteLine($"DEBUG: Apartamenti '{propertyNameForRent}' u verifikua si i listuar.");

            try
            {
                var propertyCard = wait.Until(d => d.FindElement(By.XPath($"//h3[contains(text(), '{propertyNameForRent}')]/ancestor::div[contains(@class, 'property-card-class-placeholder')]")));
                string idStr = propertyCard.GetAttribute("data-property-id");
                if (int.TryParse(idStr, out int parsedId))
                {
                    propertyIdForRent = parsedId;
                    Console.WriteLine($"Property for rent created with ID: {propertyIdForRent}");
                }
                else
                {
                    Console.WriteLine($"Could not parse property ID from attribute '{idStr}' for: {propertyNameForRent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error finding property ID for rent: {ex.Message}. propertyIdForRent will remain -1. XPath/Selector for property card might be incorrect or 'data-property-id' attribute is missing.");
            }
        }


        [Test, Order(3)]
        public void RentProperty_ValidData_ByUser()
        {
            Console.WriteLine("DEBUG: Testi RentProperty_ValidData_ByUser po fillon.");
            if (propertyIdForRent == -1 || string.IsNullOrEmpty(propertyNameForRent))
            {
                Assert.Inconclusive("Parakushti (krijimi i pronës për qira me ID valide) nuk u plotësua. Testi i qirasë anulohet.");
            }

            try
            {
                IWebElement logoutButton = driver.FindElement(By.Id("logoutButton-placeholder"));
                if (logoutButton.Displayed)
                {
                    logoutButton.Click();
                    wait.Until(d => d.Url.Contains("/login"));
                    Console.WriteLine("DEBUG: Logout si Agjent u krye.");
                }
            }
            catch (NoSuchElementException)
            {
                Console.WriteLine("DEBUG: Butoni Logout nuk u gjet (ndoshta nuk ishim të kyçur si Agjent ose ID-ja është e gabuar), vazhdohet me login-in e Përdoruesit.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DEBUG: Gabim gjatë tentativës për logout: {ex.Message}. Vazhdohet me login-in e Përdoruesit.");
            }

            driver.Navigate().GoToUrl(baseUrl + "/login");
            try
            {
                wait.Until(d => d.FindElement(By.Id("username")).Displayed);
                driver.FindElement(By.Id("username")).SendKeys("qiramarresTest");
                driver.FindElement(By.Id("password")).SendKeys("QiraPass123!");
                driver.FindElement(By.CssSelector("button[type='submit']")).Click();

                bool isLoggedInUser = false;
                try
                {
                    isLoggedInUser = wait.Until(d => d.Url.Contains("/dashboard") || d.PageSource.Contains("Welcome"));
                }
                catch (WebDriverTimeoutException)
                {
                    isLoggedInUser = false;
                }
                Assert.IsTrue(isLoggedInUser, "Login si Përdorues (qiramarresTest) dështoi ose ridrejtimi nuk ndodhi.");
                Console.WriteLine("DEBUG: Login si Përdorues (qiramarresTest) u krye me sukses.");
            }
            catch (Exception ex)
            {
                Assert.Fail($"Login si Përdorues (qiramarresTest) dështoi. Gabimi: {ex.Message}. URL aktuale: {driver.Url}");
            }

            driver.Navigate().GoToUrl(baseUrl + "/properties-for-rent-placeholder");

            IWebElement propertyToRentCard = null;
            try
            {
                wait.Until(d => d.FindElement(By.XPath($"//h3[contains(text(), '{propertyNameForRent}')]")).Displayed);
                propertyToRentCard = driver.FindElement(By.XPath($"//h3[contains(text(), '{propertyNameForRent}')]/ancestor::div[contains(@class, 'property-card-class-placeholder')]"));
            }
            catch (Exception ex)
            {
                Assert.Fail($"Prona për qira '{propertyNameForRent}' nuk u gjet në listë ose pritja dështoi. Gabimi: {ex.Message}. URL aktuale: {driver.Url}");
            }

            IWebElement rentButton = propertyToRentCard.FindElement(By.CssSelector("button.rent-action-button-placeholder"));
            rentButton.Click();
            Console.WriteLine($"DEBUG: Klikuar butoni 'Merr me Qira' për pronën '{propertyNameForRent}'.");

            try
            {
                wait.Until(d => d.FindElement(By.Id("koheZgjatjaInput_rentForm")).Displayed);
            }
            catch (WebDriverTimeoutException)
            {
                Assert.Fail("Forma e marrjes me qira nuk u shfaq.");
            }

            driver.FindElement(By.Id("koheZgjatjaInput_rentForm")).SendKeys("12");
            driver.FindElement(By.Id("bookingDateInput_rentForm")).SendKeys(DateTime.Now.ToString("yyyy-MM-dd"));
            driver.FindElement(By.Id("paymentMethodRentInput_rentForm")).SendKeys("Kartë Krediti");
            driver.FindElement(By.Id("confirmRentButton_rentForm")).Click();
            Console.WriteLine("DEBUG: Forma e qirasë u dërgua.");

            bool rentSuccessMessageDisplayed = false;
            try
            {
                rentSuccessMessageDisplayed = wait.Until(d => d.FindElement(By.CssSelector(".rent-success-message-placeholder")).Text.Contains("Qiraja u konfirmua me sukses"));
            }
            catch (WebDriverTimeoutException)
            {
                Console.WriteLine("DEBUG: Mesazhi i suksesit për qiranë nuk u gjet. Provohet verifikimi i statusit të pronës.");
                rentSuccessMessageDisplayed = false;
                driver.Navigate().Refresh();
                Thread.Sleep(2000);
                try
                {
                    wait.Until(d => d.FindElement(By.XPath($"//h3[contains(text(), '{propertyNameForRent}')]")).Displayed);
                    propertyToRentCard = driver.FindElement(By.XPath($"//h3[contains(text(), '{propertyNameForRent}')]/ancestor::div[contains(@class, 'property-card-class-placeholder')]"));
                    bool isUnavailable = propertyToRentCard.Text.Contains("Unavailable") || propertyToRentCard.Text.Contains("E Padisponueshme") || propertyToRentCard.Text.Contains("E Zënë");
                    Assert.IsTrue(isUnavailable, $"Prona '{propertyNameForRent}' nuk u shënua si e padisponueshme pas marrjes me qira.");
                    Console.WriteLine($"DEBUG: Statusi i pronës '{propertyNameForRent}' u ndryshua në e padisponueshme. Procesi i qirasë ka gjasa të ketë përfunduar me sukses.");
                    return;
                }
                catch (Exception ex)
                {
                    Assert.Fail($"As mesazhi i suksesit nuk u gjet, as statusi i pronës nuk u verifikua pas freskimit. Gabimi: {ex.Message}. URL aktuale: {driver.Url}");
                }
            }

            Assert.IsTrue(rentSuccessMessageDisplayed, "Mesazhi i suksesit për regjistrimin e qirasë nuk u shfaq.");
            Console.WriteLine("DEBUG: Testi RentProperty_ValidData_ByUser u përfundua me sukses.");
        }

        [TearDown]
        public void TearDown()
        {
            if (driver != null)
            {
                Console.WriteLine("DEBUG: Duke mbyllur WebDriver-in.");
                driver.Quit();
                driver.Dispose();
            }
        }
    }
}