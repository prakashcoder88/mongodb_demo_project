// const mongoose = require("mongoose");
// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const mocha = require("mocha");
// const should = chai.should();
// const server = require("../server");
// const responseMessage = require("../src/utils/responseMeassage.json");
// const { StatusCodes } = require("http-status-codes");
// const { expect } = chai;
// chai.use(chaiHttp);
// chai.should();

const mongoose = require("mongoose");
const responseMessage = require("../src/utils/responseMeassage.json");
var bcrypt = require("bcrypt");
const chai = require("chai");
const fs = require("fs");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const should = chai.should();
const path = require("path");
const server = require("../server");
const { expect } = chai;
chai.use(chaiHttp);
chai.should();

let userJwtToken, adminJwtToken, sellerJwtToken;

async function passwordencrypt(password) {
  let salt = await bcrypt.genSalt(10);
  let passwordHash = bcrypt.hash(password, salt);
  return passwordHash;
}


//email id alredy exist
// describe("Email already exist", () => {
//   it("should throw message email already exists", (done) => {
//         chai
//           .request(server)
//           .post("/api/user/register")
//           .send({
//             role: "seller",
//             name: "parth Patel",
//             email: "parth@example.com",
//             password: "Admin@123",
//             phone: "1000000076",
//             address: {
//               address_Line_1: "Ahmedabad",
//               City: "Ahmedabad",
//               State: "Gujarat",
//               PostalCode: "380061",
//               Country: "India",
//             },
//             referral: "04U0IoEb",
//           })
//           .end((err, res) => {
//             expect(res).to.have.status(400);
//             expect(res.body.message).to.equal('Email address alraedy register');
//             done();
//           });
//       });
// });

//password formate
// describe("Valid password formate", () => {
//   it("should create a user with a valid password format", (done) => {
//         chai
//           .request(server)
//           .post("/api/user/register")
//           .send({
//             role: "seller",
//             name: "Rakesh Patel",
//             email: "rakesh@example.com",
//             password: "Admin@123456",
//             phone: "1000000075",
//            address: {
//               address_Line_1: "Ahmedabad",
//               City: "Ahmedabad",
//               State: "Gujarat",
//               PostalCode: "380061",
//               Country: "India",
//             },
//             referral: "04U0IoEb",
//           })
//           .end((err, res) => {
//             expect(res).to.have.status(400);
//             expect(res.body.message).to.equal("Password at least 1 upperCase, lowerCase, numeric, special character and minimum 6 character must be");
//             done();
//           });
//   });
// });

// User Access
//create user
// describe("Create User API", () => {
//   it("should create a new user", (done) => {
//         chai
//           .request(server)
//           .post("/api/user/register")
//           .send({
//             name: "Rakesh Patel",
//             email: "rakesh@example.com",
//             password: "Admin@123",
//             phone: "1000000009",
//             address: {
//               address_Line_1: "Ahmedabad",
//               City: "Ahmedabad",
//               State: "Gujarat",
//               PostalCode: "380061",
//               Country: "India",
//             },
//             referral: "04U0IoEb",
//           })
//           .end((err, res) => {
//             expect(res).to.have.status(201);
//             expect(res.body.message).to.equal("User created successfully");
//             done();
//           });
//   });
// });

////////////////////////// login user  ////////////////////////

// describe("User Login API", () => {
//   it("should return 200 with user details and JWT token if login is successful", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({ masterfield: "vihay@example.com", password: "Admin@123" })
//       .end((err, res) => {
//         userJwtToken = res.body.accesstoken;
//         //console.log(userJwtToken);
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
//   // it("should return 400 if user is not found", (done) => {
//   //   chai
//   //     .request(server)
//   //     .post("/api/user/login")
//   //     .send({ masterfield: "test@example.com", password: "Admin@123" })
//   //     .end((err, res) => {
//   //       expect(res).to.have.status(404);
//   //       expect(res.body.message).to.equal("User or email   not found");
//   //       done();
//   //     });
//   // });
//   //   it("should return 401 if Your account is not active", (done) => {
//   //     chai
//   //       .request(server)
//   //       .post("/api/user/login")
//   //       .send({  masterfield: "maulik@example.com", password: "Admin@123"})
//   //       .end((err, res) => {
//   //         expect(res).to.have.status(401);
//   //         //expect(res.body.message).to.equal("You are unauthorized or your account is deleted");
//   //         done();
//   //       });
//   //   });
//   //   it("should return if Password is invalid", (done) => {
//   //     chai
//   //       .request(server)
//   //       .post("/api/user/login")
//   //       .send({  masterfield: "admin@example.com", password: "Admin@123a" })
//   //       .end((err, res) => {
//   //         expect(res).to.have.status(401);
//   //         expect(res.body.message).to.equal(
//   //           "Password not match"
//   //         );
//   //         done();
//   //       });
//   //   });
// });

// describe('Get user details', () => {
//     it("should return user details", (done) => {
//         chai
//             .request(server)
//             .get("/api/user/getuser")
//             .set("auth",userJwtToken)
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 done();
//             });
//     });
// })

//Change password user
// describe("Change password", () => {

//   it("should enter valied oldpassword ", (done) => {
//     chai
//       .request(server)
//       .patch("/api/user/changepassword")
//       .set("auth", adminJwtToken)
//       .send({ oldPassword: "test@123", newPassword: "test@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Old Password is Incorrect");
//         done();
//       });
//   });

//   it("should newpassword different from oldpassword ", (done) => {
//     chai
//       .request(server)
//       .patch("/api/user/changepassword")
//       .set("auth", adminJwtToken)
//       .send({ oldPassword: "Admin@1234", newPassword: "Admin@1234" })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         done();
//       });
//   });

//   it("should update password", (done) => {
//     chai
//       .request(server)
//       .patch("/api/user/changepassword")
//       .set("auth", adminJwtToken)
//       .send({ oldPassword: "Admin@1234", newPassword: "Admin@123" })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("Password has been successfully updated");
//         done();
//       });
//   });
// });

//Update user
// describe("update user API", () => {
//   it("should update user", async() => {
//     chai
//       .request(server)
//       .patch("/api/user/updateuser")
//       .set("auth", adminJwtToken)
//       .send({
//         email: "vijay@example.com",
//         phone: "1000000066"
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("User Data Updated Successfully");

//       });
//   });
// });

// describe("Upload Image API", () => {
//   it("should update user profile image", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/profilepic")
//       .set("auth", userJwtToken)
//       .field('Content-Type', 'multipart/form-data')
//       .attach("profileImage", path.join(path.resolve(), 'test/public/uploads/1701329714925.jpg'))
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("User Data Updated Successfully");
//         done();
//       })
//   });
// });

//ForgotPassword

// describe('Forgot Password API', () => {
//   it("should send OTP to the user's email", async() => {
//     const testUser = {
//       email: 'vihay@example.com',
//     };
//     chai
//       .request(server)
//       .post('/api/user/forgotPassword')
//       .send(testUser)
//       .end(async(err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal('Otp Send Successfully in your email');
//         await User.findByIdAndUpdate(
//           { _id: '655da47c1e465b0a11b02576' },
//           { $set: { otp: null, otpExpire: null } }
//         );
//         done();
//       });
//   });
//   it('should handle missing email', (done) => {
//     const invalidUser = {
//      // email: 'vijay@example.com',
//     };
//     chai
//       .request(server)
//       .post('/api/user/forgotPassword')
//       .send(invalidUser)
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal('Enter your email id');
//         done();
//       });
//   });
//   it('should handle non-existing email', (done) => {
//     const nonExistingUser = {
//       email: 'nonexisting@example.com',
//     };
//     chai
//       .request(server)
//       .post('/api/user/forgotPassword')
//       .send(nonExistingUser)
//       .end((err, res) => {
//         expect(res).to.have.status(404);
//         expect(res.body.message).to.equal('User or email   not found');
//         done();
//       });
//   });
// });

//Verify OTP

// describe('Verify OTP API', () => {
//   it('should successfully verify a valid OTP within the expiration time', (done) => {
//     const testUser = {
//       email: 'vihay@example.com',
//       otp: '37782',
//     };
//     chai
//       .request(server)
//       .post('/api/user/verifyOtp')
//       .send(testUser)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal('OTP verified successfully');
//         done();
//       });
//   });

// it('should handle invalid OTP', (done) => {
//   const invalidOtpUser = {
//     email: 'test@example.com',
//     otp: '23564', // Replace with an invalid OTP
//   };
//   chai
//     .request(server)
//     .post('/api/user/verifyOtp')
//     .send(invalidOtpUser)
//     .end((err, res) => {
//       expect(res).to.have.status(400);
//       expect(res.body.error).to.equal('Invalid OTP');
//       done();
//     });
// });

// it('should handle expired OTP', (done) => {
//   const expiredOtpUser = {
//     email: 'vihay@example.com',
//     otp: '37782', // Replace with an actual expired OTP
//   };
//   chai
//     .request(server)
//     .post('/api/user/verifyOtp')
//     .send(expiredOtpUser)
//     .end((err, res) => {
//       expect(res).to.have.status(400);
//       expect(res.body.error).to.equal('OTP has expired');
//       done();
//     });
// });
// });

/////////////////////////// Admin Login  ///////////////////////

// describe("Admin Login API", () => {
//   it("should return 200 with user details and JWT token if login is successful", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({ masterfield: "admin@example.com", password: "Admin@1234" })
//       .end((err, res) => {
//         adminJwtToken = res.body.accesstoken;
//         console.log(adminJwtToken);
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("User login successfully");
//         done();
//       });
//   });
// });

// Product controllor //

/////////////////////////// Seller Login //////////////////////

// describe("Seller Login API", () => {
//   it("should return 200 with user details and JWT token if login is successful", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({ masterfield: "sagar@example.com", password: "Admin@123" })
//       .end((err, res) => {
//               sellerJwtToken = res.body.accesstoken;
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("User login successfully");
//         done();
//       });
//   });
// });

/////////////////////////// Product //////////////////////
//Product Add
// describe("Product add API", () => {
//   it("should create a new Product", (done) => {
//     chai
//       .request(server)
//       .post("/api/product/add")
//       .set("auth",sellerJwtToken)
//       .send({
//         productcode: "P008",
//         brand: "Levi's",
//         category: "Jeens",
//         description: "Comfortable cotton shirt for everyday wear.",
//         seller: "Levi Cloth's",
//         material_type: "Cotten",
//         style: "Relaxed",
//         size: "L-40",
//         price: 130,
//         date: "21-11-2023",
//         reviews: "3",
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         done();
//       });
//   });
// });

//Product status API

// describe("Product status API", () => {
//   it("should product change", (done) => {

//     const productId = "655da6e41e465b0a11b025a0"
//     chai
//       .request(server)
//       .patch(`/api/product/productstatus/${productId}`)
//       .set("auth",adminJwtToken)
//       .send({
//                 status:"Approved"
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("Status update successfully");
//         done();
//       });
//   });
// });

//Like Dislike Product

// describe("likeDislikeProduct", () => {
//   it("should like a product",  (done) => {
//     chai
//       .request(server)
//       .post("/api/product/favorite")
//       .set("auth", userJwtToken)
//       .send({
//         productId: "655da5801e465b0a11b0258e",
//         isLike: true,
//       })
//       .end((err, res) => {
//         // console.log(res);
//         expect(res).to.have.status(200);
//         done();
//       });
//   });

//   it("should like a product",  (done) => {
//     chai
//       .request(server)
//       .post("/api/product/favorite")
//       .set("auth", userJwtToken)
//       .send({
//         productId: "655da5801e465b0a11b0258e",
//         isLike: false,
//       })
//       .end((err, res) => {
//         // console.log(res);
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });

//Favorite Product

// describe("favoriteProduct", () => {
//   it("should get liked products details", (done) => {
//     chai
//       .request(server)
//       .get("/api/product/favoriteproduct")
//       .set("auth", userJwtToken)

//       .end((err, res) => {
//         // console.log(res);
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// });

//searchProduct
// describe('searchProduct', () => {
//   const validQuery = 'L-40';
//   it('should return search results for a valid query', (done) => {
//     chai
//           .request(server)
//           .post(`/api/product/search?q=${validQuery}`)
//           .set("auth", userJwtToken)
//           .end((err, res) => {
//             // console.log(res);
//             expect(res).to.have.status(200);
//             done();
//           });
//   })
// it('should return a 400 status for an invalid query', (done) => {
//   chai.request(server)
//     .post('/api/product/search') // Replace with the actual endpoint path
//     .set("auth", userJwtToken)
//         .end((err, res) => {
//           // console.log(res);
//           expect(res).to.have.status(400);
//           done();
//         });
//       done();
//     });
// });

//Product Image Upload
//   describe("Upload Image API", () => {
//   it("should update Product image", (done) => {
//     const id = "655da5441e465b0a11b02586"
//     chai
//       .request(server)
//       .patch(`/api/product/productimag/${id}`)
//       .set("auth", sellerJwtToken)
//       .field('Content-Type', 'multipart/form-data')
//       .attach("profileImage", path.join(path.resolve(), 'test/public/uploads/1701862440594.jpeg'))
//       .end((err, res) => {

//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("Product image upload successfully");
//         done();
//       })
//   });
// });

//////////////////// Cart ////////////////////////////////////

// describe("addCart", (done) => {
//   it("should add a product to the cart for a valid request", (done) => {

//     const ProductId = "655da5801e465b0a11b0258e";
//     const Quantity = 1;

//     chai
//       .request(server)
//       .post("/api/cart/add")
//       .set("auth", userJwtToken)
//       .send({
//         productId: ProductId,
//         quantity: Quantity,
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body.message).to.equal(responseMessage.PRODUCTADDCART);
//         done();

//       });
//   });

// it('should handle product not found and return a 404 status', (done) => {

//   chai
//   .request(server)
//     .post('/api/cart/add')
//     .set("auth", userJwtToken)
//     .send({

//       productId: "655da5801e465b0a11b0258c",
//       quantity: 1,
//     })

//       .end((err, res) => {

//         expect(res).to.have.status(404);
//         expect(res.body.message).to.equal(responseMessage.PRODUCTNOTFOUND);
//         done();
//     });
// });

// it('should handle insufficient stock and return a 400 status', (done) => {

//   const productId = '655da5801e465b0a11b0258e';
//   const Stock = 100;

//   chai.request(server)
//     .post('/api/cart/add')
//     .set("auth", userJwtToken)
//     .send({

//       productId: productId,
//       quantity: Stock,
//     })
//     .end((err, res) => {
//     expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Product stock not available to given quantity");
//         done();
//     })
// });

// })

//////////////////// Order ////////////////////////////////////

// describe("orderCreate", () => {
// it('should create an order for a valid request', (done) => {

//   const CartId = '657062c0a45efee0b201303b';
//   const Status = 'completed';

//   chai
//   .request(server)
//     .post('/api/order/ordercreate')
//     .set("auth", userJwtToken)
//     .send({

//       cartId: CartId,
//       status: Status,
//     })
//     .end((err, res) => {

//               expect(res).to.have.status(201);
//               expect(res.body.message).to.equal("Order created successfully");
//               done();
//           });
// });

// it("should handle no items in the cart and return a 400 status", (done) => {
//   const CartId = "657062c0a45efee0b201303c";

//   chai
//     .request(server)
//     .post("/api/order/ordercreate")
//     .set("auth", userJwtToken)
//     .send({
//       cartId: CartId,
//       status: "completed",
//     })
//     .end((err, res) => {
//       expect(res).to.have.status(400);
//       expect(res.body.message).to.equal("No items in cart");
//       done();
//     });
// });

//   it('should handle product not found and return a 400 status', (done) => {
//     const productId = '657070fdad264d0151a6302c';
//     const cartId = '65715eb342cf22e33968244f';

//     chai.request(server)
//       .post('/api/order/ordercreate')
//       .set("auth", userJwtToken)
//       .send({
//         productId: productId,
//         cartId: cartId,

//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Product not found");
//         done();
//       });
// });

//   it('should handle insufficient stock and return a 400 status', (done) => {

//     const Stock = '100';

//     const CartId = '65715eb342cf22e33968244f';

//     chai.request(server)
//       .post('/api/order/ordercreate')
//       .set("auth", userJwtToken)
//       .send({
//         cartId: CartId,
//       })
//         .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Out of stock");
//         done();
//       });
//   });
// });
