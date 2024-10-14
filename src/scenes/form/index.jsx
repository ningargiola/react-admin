import { Box, Button, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { auth, db } from "../../firebase";  // Import Firebase auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";  // Import Firebase storage

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState("");
  const [devTagLight, setDevTagLight] = useState(null);
  const [devTagDark, setDevTagDark] = useState(null);
  const [lightUploaded, setLightUploaded] = useState(false);  // Track light file upload status
  const [darkUploaded, setDarkUploaded] = useState(false);    // Track dark file upload status
  const storage = getStorage();  // Initialize Firebase storage

  const handleFormSubmit = async (values, actions) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      setSuccessMessage("New user created successfully!");

      let devTagLightURL = "";
      let devTagDarkURL = "";

      // Upload devtag light
      if (devTagLight) {
        const lightRef = ref(storage, `devtags/${user.uid}-light`);
        const snapshot = await uploadBytes(lightRef, devTagLight);
        devTagLightURL = await getDownloadURL(snapshot.ref);
      }

      // Upload devtag dark
      if (devTagDark) {
        const darkRef = ref(storage, `devtags/${user.uid}-dark`);
        const snapshot = await uploadBytes(darkRef, devTagDark);
        devTagDarkURL = await getDownloadURL(snapshot.ref);
      }

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        contact: values.contact,
        position: values.position,
        address1: values.address1,
        accesslevel: values.accesslevel,
        nickname: values.nickname,
        uid: user.uid,
        devTagLight: devTagLightURL,   // Store light devtag URL
        devTagDark: devTagDarkURL,     // Store dark devtag URL
      });

      actions.resetForm();

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDevTagLightChange = (event) => {
    setDevTagLight(event.target.files[0]);
    setLightUploaded(true);  // Set light file as uploaded
  };

  const handleDevTagDarkChange = (event) => {
    setDevTagDark(event.target.files[0]);
    setDarkUploaded(true);  // Set dark file as uploaded
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />
      {successMessage && (
        <Typography variant="h6" color="green" mb={2}>
          {successMessage}
        </Typography>
      )}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Position"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.position}
                name="position"
                error={!!touched.position && !!errors.position}
                helperText={touched.position && errors.position}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nickname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.position}
                name="nickname"
                error={!!touched.position && !!errors.position}
                helperText={touched.position && errors.position}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl 
                fullWidth 
                variant="filled" 
                sx={{ gridColumn: "span 1" }} 
                error={!!touched.accesslevel && !!errors.accesslevel}
              >
              <InputLabel>Access Level</InputLabel>
              <Select
                label="Access Level"
                name="accesslevel"
                value={values.accesslevel}
                onBlur={handleBlur}
                onChange={handleChange}
              >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
              </Select>
              {touched.accesslevel && errors.accesslevel && (
              <Typography variant="caption" color="error">
              {errors.accesslevel}
              </Typography>
              )}
            </FormControl>

              {/* Styled Devtag Light Upload */}
              <Box sx={{ gridColumn: "span 2" }}>
              <Typography variant="body1" sx={{ mb: 1 }}>Devtag Light Mode</Typography>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ padding: "16.5px 14px" }}
                color={lightUploaded ? "success" : "secondary"}  // Change color based on upload status
              >
                {lightUploaded ? "Light Devtag Uploaded" : "Upload Light Devtag"}  {/* Change button text */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDevTagLightChange}
                  hidden
                />
              </Button>
            </Box>
            {/* Styled Devtag Dark Upload */}
            <Box sx={{ gridColumn: "span 2" }}>
              <Typography variant="body1" sx={{ mb: 1 }}>Devtag Dark Mode</Typography>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ padding: "16.5px 14px" }}
                color={darkUploaded ? "success" : "secondary"}  // Change color based on upload status
              >
                {darkUploaded ? "Dark Devtag Uploaded" : "Upload Dark Devtag"}  {/* Change button text */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDevTagDarkChange}
                  hidden
                />
              </Button>
            </Box>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  position: yup.string().required("required"),
  address1: yup.string().required("required"),
  accesslevel: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  contact: "",
  position: "",
  nickname: "",
  address1: "",
  accesslevel: "",
};

export default Form;
