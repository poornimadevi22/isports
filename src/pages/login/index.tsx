"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import Image from "next/image";
import {
  USER_ERROR,
  IMAGES,
  SESSION,
  RESPONSE_CODE,
} from "../../utils/constants";
import { fetchLoginAsync, clearError } from "@/redux/slices/loginSplice";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { setLocalStorage } from "@/utils/helper";

const CustomTextField = styled(TextField)(({}) => ({
  height: "48px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#e6fff6",
    "& fieldset": {
      borderColor: "#40a377",
    },
    "&:hover fieldset": {
      borderColor: "#40a377",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#40a377",
    },
  },
  "& input": {
    fontFamily: "Roboto",
    paddingLeft: "10px",
    color: "#000000",
    height: "10px",
  },
  "& input::placeholder": {
    color: "#8D9093",
    opacity: 1,
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));
const StyledButton = styled(Button)(({}) => ({
  marginBottom: "1rem",
  height: "58px",
  background: "#008755",
  color: "white",
  border: "none",
  fontFamily: "Dubai",
  fontSize: "22px",
  fontWeight: 500,
  lineHeight: "30px",
  textAlign: "left",
  "&:disabled": {
    color: "white",
  },
  borderRadius: "4px",
  width: "100%",
}));
const CustomCheckbox = styled("input")(({}) => ({
  appearance: "none",
  width: "20px",
  height: "20px",
  borderRadius: "5px",
  border: "2px solid green",
  outline: "none",
  cursor: "pointer",
  position: "relative",
  "&:checked": {
    backgroundColor: "green",
    border: "2px solid darkgreen",
  },
  "&:checked::after": {
    content: '""',
    position: "absolute",
    left: "5px",
    top: "1px",
    width: "5px",
    height: "10px",
    border: "solid white",
    borderWidth: "0 2px 2px 0",
    transform: "rotate(45deg)",
  },
}));
interface FormData {
  email: string;
  password: string;
}
interface FormErrors {
  email?: string;
  password?: string;
}
const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const loginData = useSelector((state: RootState) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showBanner, setShowBanner] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (_.isEmpty(formData.email)) {
      newErrors.email = USER_ERROR.EMAIL_REQUIRED;
    }
    // else if (!REGEX.EMAIL.test(formData.email)) {
    //   newErrors.email = USER_ERROR.EMAIL_INVALID;
    // }
    if (_.isEmpty(formData.password)) {
      newErrors.password = USER_ERROR.PASSWORD_REQUIRED;
    }
    setErrors(newErrors);
    if (_.isEmpty(newErrors)) {
      const params = {
        username: formData.email,
        password: formData.password,
      };
      dispatch(fetchLoginAsync(params));
    }
  };
  useEffect(() => {
    if (
      loginData &&
      loginData.code === RESPONSE_CODE.SUCCESS &&
      !_.isEmpty(loginData?.data?.data)
    ) {
      const userData = loginData.data[0];
      setLocalStorage(SESSION.TOKEN, userData);
      window.location.href = "/dashboard";
      dispatch(clearError());
    } else if (
      (loginData && loginData.code === RESPONSE_CODE.ERROR) ||
      (loginData &&
        loginData.code === RESPONSE_CODE.SUCCESS &&
        _.isEmpty(loginData?.data?.data))
    ) {
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        dispatch(clearError());
      }, 3000);
    }
  }, [loginData]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };
  return (
    <Grid
      container
      minHeight="100vh"
      spacing={0}
      columns={{ xs: 12, md: 12, lg: 12, xl: 13.5 }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={6.75}
        lg={6.5}
        xl={6.25}
        display={{
          xs: "none",
          md: "flex",
        }}
        justifyContent="center"
        alignItems={{ sm: "center", md: "start" }}
        sx={{
          position: "relative",
          backgroundColor: "#f5f5f5",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundImage: 'url("/loginBg.svg")',
            backgroundSize: "cover",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "35%",
            width: "263px",
            height: "233px",
            backgroundImage: 'url("/policeLogo.svg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: "2",
          }}
        />
        <Typography
          textAlign={"center"}
          mt={"15%"}
          className="bukra home-page-header"
          color="#FFFFFF"
          letterSpacing={"2px"}
          sx={{ opacity: "0.90" }}
        >
          Dubai Police <br />{" "}
          <span className="home-page-sub-header">Sports Monitoring System</span>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={5.25}
        lg={5.5}
        xl={7.25}
        display="flex"
        justifyContent="center"
        alignItems={{ xs: "top", md: "center" }}
        sx={{
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          width={{ sm: "100%", xl: "65%" }}
          mx={{ sm: 5, md: 1, lg: 1, xl: 5 }}
          px={{ sm: 5, md: 2, lg: 3, xl: 5 }}
        >
          <Box
            display="flex"
            justifyContent={{ xs: "end", md: "center" }}
            mb={{ xs: 5, md: 2 }}
          >
            <Image
              src={IMAGES.logo}
              alt="logo"
              style={{ width: "183px", height: "100px" }}
            />
          </Box>
          <Typography
            variant="h4"
            gutterBottom
            textAlign={{ xs: "center", md: "left" }}
            className="bukra"
            sx={{
              fontWeight: 600,
              color: "#008755",
              fontFamily: "29LT Bukra",
              fontSize: "28px",
              lineHeight: "40.35px",
            }}
            pt={{ xs: 5, md: 0 }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            textAlign={{ xs: "center", md: "left" }}
            width={{ xs: "100%", lg: "70%", xl: "90%" }}
            sx={{
              color: "#8D9093",
              marginBottom: "2rem",
              fontFamily: "Dubai",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "22px",
            }}
            className="dubai-med"
          >
            Please sign in to your account and take your performance to the next
            level.
          </Typography>
          <form onSubmit={handleSubmit}>
            {showBanner && (
              <Snackbar
                open={showBanner}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={handleClose}
                  severity="error"
                  variant="filled"
                  className="dubai-med"
                >
                  {/* {loginData && loginData.data && loginData.data.message} */}
                  Please check your login credentials!
                </Alert>
              </Snackbar>
            )}
            <Typography
              variant="h4"
              gutterBottom
              align="left"
              sx={{
                fontWeight: 500,
                color: "#000000",
                fontFamily: "Dubai",
                fontSize: "22px",
                lineHeight: "30px",
                textAlign: "left",
              }}
              className="dubai-med"
            >
              User Name Or Email Address
            </Typography>
            <CustomTextField
              name="email"
              placeholder="Enter email address"
              type="text"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              className="Text-field-customise"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ marginRight: "8px", fontSize: "18px" }}
                  >
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: false,
              }}
            />
            {errors.email && (
              <Typography
                variant="caption"
                color="red"
                sx={{
                  fontFamily: "Dubai",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "33.76px",
                  textAlign: "left",
                  marginTop: "0.5rem",
                }}
              >
                {errors.email}
              </Typography>
            )}
            <Typography
              variant="h4"
              gutterBottom
              align="left"
              sx={{
                fontWeight: 500,
                color: "#000000",
                fontFamily: "Dubai",
                fontSize: "22px",
                lineHeight: "30px",
                textAlign: "left",
              }}
              className="dubai-med"
            >
              Password
            </Typography>
            <CustomTextField
              name="password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={formData.password}
              className="Text-field-customise"
              onChange={(e) => handleChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ marginRight: "8px", fontSize: "18px" }}
                  >
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ fontSize: "18px" }}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: false,
              }}
            />
            {errors.password && (
              <Typography
                variant="caption"
                color="red"
                sx={{
                  fontFamily: "Dubai",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "33.76px",
                  textAlign: "left",
                  marginTop: "0.5rem",
                }}
              >
                {errors.password}
              </Typography>
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                marginBottom: "1rem",
              }}
            >
              <Box display="flex" alignItems="center">
                <CustomCheckbox
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="remember"
                  style={{ marginLeft: "10px", color: "black" }}
                  className="dubai-med"
                >
                  Remember me
                </label>
              </Box>
              <Box>
                <a
                  href="#"
                  style={{ color: "black", textDecoration: "none" }}
                  className="dubai-med"
                >
                  Forgot password?
                </a>
              </Box>
            </Box>
            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loginData.isLoading}
              className="dubai-med text-capitalize"
            >
              {loginData.isLoading ? (
                <>
                  <CircularProgress
                    sx={{ color: "#FFFFFF", mr: 1.5 }}
                    size="20px"
                  />
                  Please wait...
                </>
              ) : (
                "Login"
              )}
            </StyledButton>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default Login;