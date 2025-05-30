using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.UI.Tests.Tests
{
    public class AliTests
    {
        private IWebDriver driver;
        private string testPronaName = "Test Property For Sale"; 
        private string buyerUserId = "test_buyer_user_001"; 

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
            
        }

        [Test, Order(1)]
        public void Login_AsSeller() 
        {
            driver.Navigate().GoToUrl("http://localhost:5173/login");

            driver.FindElement(By.Id("username")).SendKeys("Rijad"); 
            driver.FindElement(By.Id("password")).SendKeys("Rijad@123");
            driver.FindElement(By.CssSelector("button[type='submit']")).Click();

            
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(d => d.Url.Contains("/dashboard") || d.PageSource.Contains("Welcome"));

            Assert.IsTrue(driver.Url.Contains("/dashboard") || driver.PageSource.Contains("Welcome"),
                "Login failed or did not redirect to dashboard.");
        }

        [Test, Order(2)]
        public void CreateProna_ForSale()
        {
            
            if (!driver.Url.Contains("/dashboard"))
            {
                Login_AsSeller(); 
            }
            driver.Navigate().GoToUrl("http://localhost:5173/dashboard"); 

            try
            {
                driver.FindElement(By.Id("emri")).SendKeys(testPronaName); 
                driver.FindElement(By.Id("adresa")).SendKeys("123 Test Sale Avenue"); 
                driver.FindElement(By.Id("price")).SendKeys("150000");
                driver.FindElement(By.Id("description")).SendKeys("A beautiful property listed for sale."); 
                driver.FindElement(By.Id("type")).SendKeys("Sell");

                driver.FindElement(By.Id("photo")).SendKeys("https://via.placeholder.com/300");

                driver.FindElement(By.Id("submitBtn")).Click(); 

               
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
                wait.Until(d => d.PageSource.Contains(testPronaName) || d.PageSource.Contains("Property created successfully"));

                Assert.IsTrue(driver.PageSource.Contains(testPronaName),
                    $"Property '{testPronaName}' was not found on the page after creation.");
            }
            catch (NoSuchElementException ex)
            {
                Assert.Fail($"Could not find an element on the property creation page: {ex.Message}. Check your element IDs.");
            }
        }

        [Test, Order(3)]
        public void CreateSell_ForExistingProna()
        {
            if (!driver.Url.Contains("/dashboard") && !driver.PageSource.Contains("Welcome")) 
            {
                Login_AsSeller();
            }

            
            driver.Navigate().GoToUrl("http://localhost:5173/create-sale"); 

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

            try
            {
               
                
                var pronaDropdown = wait.Until(d => d.FindElement(By.Id("pronaId_dropdown"))); 
                var selectProna = new SelectElement(pronaDropdown);
                
                selectProna.SelectByText(testPronaName);

                
                var buyerIdInput = wait.Until(d => d.FindElement(By.Id("buyerUserId_input"))); 
                buyerIdInput.SendKeys(buyerUserId);

                
                var saleDateInput = wait.Until(d => d.FindElement(By.Id("saleDate_input"))); 
                saleDateInput.SendKeys(DateTime.Now.ToString("yyyy-MM-dd")); 

                
                var salePriceInput = wait.Until(d => d.FindElement(By.Id("salePrice_input"))); 
                salePriceInput.SendKeys("145000"); 

                
                var paymentMethodInput = wait.Until(d => d.FindElement(By.Id("paymentMethod_input"))); 
                paymentMethodInput.SendKeys("Bank Transfer");
                

                driver.FindElement(By.Id("submitSellButton")).Click();

                
                bool saleConfirmed = wait.Until(d =>
                    d.PageSource.Contains("Sale created successfully") ||
                    d.PageSource.Contains($"Sale recorded for {testPronaName}") || 
                    d.Url.Contains("/sales/") 
                );

                Assert.IsTrue(saleConfirmed, "Sale creation confirmation message not found or redirection failed.");


            }
            catch (NoSuchElementException ex)
            {
                Assert.Fail($"Could not find an element on the create sell page: {ex.Message}. Check your element IDs and page URL.");
            }
            catch (WebDriverTimeoutException ex)
            {
                Assert.Fail($"Timeout waiting for an element or condition on the create sell page: {ex.Message}.");
            }
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
