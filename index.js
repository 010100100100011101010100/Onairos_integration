import React from "react";
import {
  DCBLogoWBG,
  GeneralBg,
  GoogleIconLogin,
  SignUpButton,
  SignUpDesign,
  SignUpFormDesign,
  SignUpGithubIcon,
  SignUpGoogleIcon,
  SignUpIconButton,
  SignUpLineDesign,
} from "../../../assets/export";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import {
  Flex,
  Box,
  Image,
  Text,
  Input,
  Button,
  FormErrorMessage,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SmallFooter from "../../../components/common/Footer/smallFooter";
import axios from "axios";
import { auth } from "../../../api/service/Firebase";
import { api } from "../../../backendApi";
import useResponsive from "../../../hooks/UseResponsive";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// Define validation schema with Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
});

const SignUp = () => {
  const { screenWidth, isMobile, isTablet, isDesktop } = useResponsive();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const gettoast = (color, data) => {
    toast({
      position: "top-center",
      duration: 2000,
      render: () => (
        <Box
          color="white"
          p={3}
          mt={15}
          bg={color}
          outline={"2px solid #330F57"}
          zIndex={"2"}
        >
          {data}
        </Box>
      ),
    });
  };

  const doSignInWithGoogle = async (credentialResponse) => {
    if (credentialResponse?.credential) {
      const user = jwtDecode(credentialResponse.credential);

      const uniqueUser =
        user.name.slice(0, 1) +
        user.email.slice(0, 6) +
        Math.floor(Math.random() * 1000000);

      try {
        const data = await axios.post(
          `${api}/createUser`,
          {
            userName: uniqueUser,
            email: user.email,
            password: user.email,
            referalCodeType: "",
          },
          {
            withCredentials: true,
          }
        );
        const datai = data.data.user;
        localStorage.setItem("token", data.data.token);

        await axios.post(`${api}/users/${datai._id}/addNft`, {
          theme: datai.theme,
          link: datai.nftImage,
          description: datai.description,
          category: "signUp",
        });

        await axios.patch(`${api}/updateUser/${datai._id}`, {
          points: 50,
        });

        gettoast("#B026FF", "Account Created Successfully");
        setTimeout(() => {
          window.location.replace("/town-hall");
        }, 2500);
      } catch (error) {
        gettoast(
          "red.600",
          "User already exists. Please choose a different username or email."
        );
      }
    } else {
      console.error("Invalid Google Credential Response", credentialResponse);
      gettoast("red.600", "Invalid Google login response. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const registerUser = await axios.post(
        `${api}/createUser`,
        {
          userName: data.username,
          email: data.email,
          password: data.password,
          referalCodeType: "",
        },
        {
          withCredentials: true,
        }
      );

      const datai = registerUser.data.user;
      localStorage.setItem("token", registerUser.data.token);

      await axios.post(`${api}/users/${datai._id}/addNft`, {
        theme: datai.theme,
        link: datai.nftImage,
        description: datai.description,
        category: "signUp",
      });
      await axios.patch(`${api}/updateUser/${datai._id}`, {
        points: 50,
      });
      gettoast("#B026FF", "Account Created Successfully");
      setTimeout(() => {
        window.location.replace("/town-hall");
      }, 2500);
    } catch (error) {
      gettoast("red.600", "Please Try Again");
    }
  };

  const toast = useToast();
  return (
    <>
      <Flex
        height={"100vh"}
        alignItems={"center"}
        flexDirection={"column"}
        bgImage={GeneralBg}
      >
        <Flex
          pos={"relative"}
          width={isMobile ? "max-content" : "944px"}
          height={isMobile ? "max-content" : "568px"}
          flexShrink={0}
          mt={"40px"}
          flexDirection={"column"}
          {...(isMobile && {
            bg: "#280E3C",
            outline: "2px solid #B026FF",
            transform: "scale(.8)",
          })}
        >
          {!isMobile && <SignUpDesign />}
          <Flex mt={"24px"} width={"100%"} justifyContent={"center"}>
            <Image
              src={DCBLogoWBG}
              zIndex={1}
              width={"216px"}
              height={"50px"}
              mb={3}
            />
          </Flex>
          <Flex flexDir={isMobile ? "column" : "row"} alignItems={"center"}>
            <Flex flexDirection={"column"} px={"70px"}>
              <Box
                position={"relative"}
                display="flex"
                width="317.285px"
                height="44px"
                justifyContent="center"
                alignItems="center"
                flexShrink={0}
                as={Button}
                bg={"transparent"}
                _hover={{
                  bg: "transparent",
                }}
                onClick={() => doSignInWithGoogle()}
              >
                {/* <SignUpIconButton /> */}
                <GoogleLogin
                  onSuccess={(credentialResponse) =>
                    doSignInWithGoogle(credentialResponse)
                  }
                  onError={() =>
                    gettoast(
                      "red.600",
                      "Google sign-in failed. Please try again."
                    )
                  }
                />
                <Flex
                  color="#FFF"
                  fontFamily="PROXON"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="16px"
                  alignItems={"center"}
                  columnGap={2}
                >
                  {/* <SignUpGoogleIcon /> */}
                  {/* <Box>Create Account using Google</Box> */}
                </Flex>
              </Box>
              <Box
                as={Button}
                mt={"30px"}
                position={"relative"}
                display="flex"
                width="317.285px"
                height="44px"
                justifyContent="center"
                alignItems="center"
                flexShrink={0}
                bg={"transparent"}
                _hover={{
                  bg: "transparent",
                }}
              >
                <SignUpIconButton />
                <Flex
                  color="#FFF"
                  fontFamily="PROXON"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="16px"
                  alignItems={"center"}
                  columnGap={2}
                >
                  <SignUpGithubIcon />
                  <Box>Create Account using Github</Box>
                </Flex>
              </Box>
              <Box
                my={"25px"}
                color="#FFF"
                textAlign="center"
                fontFamily="PROXON"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="400"
                lineHeight="16px"
              >
                OR
              </Box>
              <Text
                color="#FFF"
                textAlign="center"
                fontFamily="PROXON"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="400"
                lineHeight="16px"
                zIndex={1}
              >
                Already have an account?{" "}
                <span className="text-[#FFA116]">
                  <a href="/login">Log in</a>
                </span>
              </Text>
            </Flex>
            <Flex justifyContent={"center"} mt={"40px"}>
              {!isMobile && <SignUpLineDesign />}
            </Flex>
            <Flex
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              flexDirection={"column"}
              mt={errors ? "10px" : "30px"}
              px={"55px"}
              overflowY={"scroll"}
              height={"450px"}
              sx={{
                /* Width of the scrollbar */
                "&::-webkit-scrollbar": {
                  width: "8px",
                },

                /* Thumb of the scrollbar */
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#9225D6",
                },
              }}
            >
              <Box>
                <Text fontFamily={"PROXON"} zIndex={1}>
                  Email
                </Text>
                <Box pos={"relative"}>
                  <SignUpFormDesign />
                  <Input
                    {...register("email")}
                    width="327.999px"
                    height="45.672px"
                    flexShrink={0}
                    borderColor={"transparent"}
                    focusBorderColor="transparent"
                    _hover={{
                      borderColor: "transparent",
                    }}
                    fontFamily={"VTF"}
                    placeholder="Enter Your Email"
                    fontSize={"12px"}
                    _placeholder={{
                      color: "rgba(255, 255, 255, 0.50)",
                    }}
                  />
                  {errors.email?.message && (
                    <Text
                      color="red.500"
                      fontSize="0.75rem"
                      mt={1}
                      fontFamily={"PROXON"}
                      maxWidth={"19.56238rem"}
                    >
                      {errors.email?.message}
                    </Text>
                  )}
                </Box>
              </Box>
              <Box mt={"10px"}>
                <Text fontFamily={"PROXON"} zIndex={1}>
                  Username
                </Text>
                <Box pos={"relative"}>
                  <SignUpFormDesign />
                  <Input
                    {...register("username")}
                    width="327.999px"
                    height="45.672px"
                    flexShrink={0}
                    borderColor={"transparent"}
                    focusBorderColor="transparent"
                    _hover={{
                      borderColor: "transparent",
                    }}
                    fontFamily={"VTF"}
                    placeholder="Create Your Username"
                    fontSize={"12px"}
                    _placeholder={{
                      color: "rgba(255, 255, 255, 0.50)",
                    }}
                  />
                  {errors.username?.message && (
                    <Text
                      color="red.500"
                      fontSize="0.75rem"
                      mt={1}
                      fontFamily={"PROXON"}
                      maxWidth={"19.56238rem"}
                    >
                      {errors.username?.message}
                    </Text>
                  )}
                </Box>
              </Box>
              <Box mt={"10px"}>
                <Text fontFamily={"PROXON"} zIndex={1}>
                  Create Password
                </Text>
                <Box pos={"relative"}>
                  <SignUpFormDesign />
                  <Input
                    {...register("password")}
                    type="password"
                    width="327.999px"
                    height="45.672px"
                    flexShrink={0}
                    borderColor={"transparent"}
                    focusBorderColor="transparent"
                    _hover={{
                      borderColor: "transparent",
                    }}
                    fontFamily={"VTF"}
                    placeholder="Create Your Password"
                    fontSize={"12px"}
                    _placeholder={{
                      color: "rgba(255, 255, 255, 0.50)",
                    }}
                  />
                  {errors.password?.message && (
                    <Text
                      color="red.500"
                      fontSize="0.75rem"
                      mt={1}
                      fontFamily={"PROXON"}
                      maxWidth={"19.56238rem"}
                    >
                      {errors.password?.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text
                    mt={"10px"}
                    color="#FFF"
                    fontFamily="PROXON"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="normal"
                    zIndex={1}
                    pos={"relative"}
                    pb={2}
                  >
                    Verify
                  </Text>
                  <Box zIndex={3} position={"relative"} h={"74px"} w={"300px"}>
                    <ReCAPTCHA
                      className="signUp-container-recaptcha"
                      sitekey="6LcwgB4qAAAAANizD5JJPMDw4OqiFXPsR3MYQQP_"
                      // onChange={(e) => setFormData({ ...formData, recaptchaValue: e })}
                    />
                  </Box>
                </Box>

                <Box pos={"relative"} mt={"25px"}>
                  <SignUpButton />
                  <Flex
                    _hover={{
                      bg: "transparent",
                    }}
                    justifyContent={"center"}
                    alignItems={"center"}
                    as={Button}
                    width="327.999px"
                    height="45.672px"
                    flexShrink={0}
                    color="#FFF"
                    bg={"transparent"}
                    fontFamily="PROXON"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="normal"
                    letterSpacing="3.2px"
                    type="submit"
                  >
                    SIGN UP
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <SmallFooter />
      </Flex>
    </>
  );
};

export default SignUp;
