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

// let token;

// describe("User Registration API", () => {
//    // Test case: email already exists
//    it("should throw message email already exists", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/register")
//       .send({
//         role: "seller",
//         name: "parth Patel",
//         email: "parth@example.com",
//         password: "Admin@123",
//         phone: "1000000076",
//         address: {
//           address_Line_1: "Ahmedabad",
//           City: "Ahmedabad",
//           State: "Gujarat",
//           PostalCode: "380061",
//           Country: "India",
//         },
//         referral: "04U0IoEb",
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal('Email address alraedy register');
//         done();
//       });
//   });

//   // Test case: valid password format
//   it("should create a user with a valid password format", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/register")
//       .send({
//         role: "seller",
//         name: "Rakesh Patel",
//         email: "rakesh@example.com",
//         password: "Admin@123456",
//         phone: "1000000075",
//        address: {
//           address_Line_1: "Ahmedabad",
//           City: "Ahmedabad",
//           State: "Gujarat",
//           PostalCode: "380061",
//           Country: "India",
//         },
//         referral: "04U0IoEb",
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal("Password at least 1 upperCase, lowerCase, numeric, special character and minimum 6 character must be");
//         done();
//       });
//   });
//   // Test case: should create a new user
//   it("should create a new user", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/register")
//       .send({
//         name: "Rakesh Patel",
//         email: "rakesh@example.com",
//         password: "Admin@123",
//         phone: "1000000009",
//         address: {
//           address_Line_1: "Ahmedabad",
//           City: "Ahmedabad",
//           State: "Gujarat",
//           PostalCode: "380061",
//           Country: "India",
//         },
//         referral: "04U0IoEb",
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body.message).to.equal(responseMessage.created);
//         done();
//       });
//   });

// });

const mongoose = require("mongoose");
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
// const image = `${__dirname} /../public/uploads/1701318764922.jpg`
let userJwtToken, adminJwtToken, sellerJwtToken, myPassword;
let token;
async function passwordencrypt(password) {
  let salt = await bcrypt.genSalt(10);
  let passwordHash = bcrypt.hash(password, salt);
  return passwordHash;
}

// for insert data manual
// before(async () => {
//   const password = "Admin@123";

//   await mongoose.connect("mongodb://localhost:27017/demo_mongo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   //  password
//   myPassword = await passwordencrypt(password);
//   await mongoose.connection.collection("admins").insertOne({
//     role: "admin",
//     name: "Admin Test",
//     email: "admin@test.com",
//     password: myPassword,
//   });
// });

// general
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

// user access
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

//login user
// describe("User Login API", () => {
//   it("should return 200 with user details and JWT token if login is successful", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({ masterfield: "vihay@example.com", password: "Admin@123" })
//       .end((err, res) => {
//         userJwtToken = res.body.accesstoken;
//         // console.log(adminJwtToken);
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
// it("should return 400 if user is not found", (done) => {
//   chai
//     .request(server)
//     .post("/api/user/login")
//     .send({ masterfield: "test@example.com", password: "Admin@123" })
//     .end((err, res) => {
//       expect(res).to.have.status(404);
//       expect(res.body.message).to.equal("User or email   not found");
//       done();
//     });
// });
//   it("should return 401 if Your account is not active", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({  masterfield: "maulik@example.com", password: "Admin@123"})
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         //expect(res.body.message).to.equal("You are unauthorized or your account is deleted");
//         done();
//       });
//   });
//   it("should return if Password is invalid", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({  masterfield: "admin@example.com", password: "Admin@123a" })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.message).to.equal(
//           "Password not match"
//         );
//         done();
//       });
//   });
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

//update user
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
//   it('should send OTP to the user\'s email', async() => {
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
//     otp: '23564', // Replace with an actual invalid OTP
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

//Admin Login

describe("Admin Login API", () => {
  it("should return 200 with user details and JWT token if login is successful", (done) => {
    chai
      .request(server)
      .post("/api/user/login")
      .send({ masterfield: "admin@example.com", password: "Admin@1234" })
      .end((err, res) => {
        adminJwtToken = res.body.accesstoken;
        console.log(adminJwtToken);
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("User login successfully");
        done();
      });
  });
});

//Product controllor

// describe("Seller Login API", () => {
//   it("should return 200 with user details and JWT token if login is successful", (done) => {
//     chai
//       .request(server)
//       .post("/api/user/login")
//       .send({ masterfield: "sagar@example.com", password: "Admin@123" })
//       .end((err, res) => {
//         sellerJwtToken = res.body.accesstoken;
//         console.log(sellerJwtToken);
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equal("User login successfully");
//         done();
//       });
//   });
// });

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

describe("Product status API", () => {
  it("should product change", (done) => {

    const productId = "655da6e41e465b0a11b025a0"
    chai
      .request(server)
      .patch(`/api/product/productstatus/${productId}`)
      .set("auth",adminJwtToken)
      .send({
                status:"Approved"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Status update successfully");
        expect(res.body.data).to.have.property('status', 'Approved');
        done();
      });
  });
});
