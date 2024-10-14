import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Card, CardMedia, Button } from "@mui/material";
import { useAuth } from "../../authprovider"; // Ensure this is correctly imported
import { auth, db, storage } from "../../firebase"; // Ensure proper Firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Settings = () => {
  const { currentUser } = useAuth(); // Get the current logged-in user
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [contact, setContact] = useState("");
  const [address1, setAddress1] = useState("");
  const [nickname, setNickname] = useState("");
  const [devTagLight, setDevTagLight] = useState("");
  const [devTagDark, setDevTagDark] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0); // Track the upload progress

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, get the user ID
        const uid = user.uid;
        setUserId(uid);

        // Fetch user data from Firestore
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data(); // Get the user data from Firestore

          setUserData(data); // Set userData state
          setFirstName(data.firstName || ""); // Set firstName
          setLastName(data.lastName || ""); // Set lastName
          setEmail(data.email || ""); // Set email
          setPosition(data.position || ""); // Set position
          setContact(data.contact || ""); // Set contact
          setAddress1(data.address1 || ""); // Set address
          setNickname(data.nickname || ""); // Set nickname

          if (data.devTagLight) {
            setDevTagLight(data.devTagLight); // From Firestore if URL is saved
          } else {
            const devTagLightRef = ref(storage, `devtags/${uid}-light`);
            const devTagLightURL = await getDownloadURL(devTagLightRef);
            setDevTagLight(devTagLightURL);
          }

          if (data.devTagDark) {
            setDevTagDark(data.devTagDark); // From Firestore if URL is saved
          } else {
            const devTagDarkRef = ref(storage, `devtags/${uid}-dark`);
            const devTagDarkURL = await getDownloadURL(devTagDarkRef);
            setDevTagDark(devTagDarkURL);
          }
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User is not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to handle image upload (Light or Dark Dev Tag)
  const handleImageUpload = (event, tagType) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `devtags/${userId}-${tagType}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed: ", error);
      },
      async () => {
        // Get download URL after upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (tagType === "light") {
          setDevTagLight(downloadURL);
        } else if (tagType === "dark") {
          setDevTagDark(downloadURL);
        }

        // Update Firestore with the new URL
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { [tagType === "light" ? "devTagLight" : "devTagDark"]: downloadURL }, { merge: true });
        console.log("Image uploaded successfully!");
      }
    );
  };

  // Handle save action
  const handleSave = async () => {
    if (userId) {
      const userRef = doc(db, "users", userId);

      const updatedData = {
        firstName,
        lastName,
        email,
        position,
        contact,
        address1,
        nickname,
        devTagLight,
        devTagDark,
      };

      try {
        await setDoc(userRef, updatedData, { merge: true });
        alert("User data updated successfully!");
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update user data.");
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>

      {userData ? (
        <Box mt={3}>
          <Typography variant="h6">Profile Information</Typography>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} // Update state on change
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} // Update state on change
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on change
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            margin="normal"
            value={position}
            onChange={(e) => setPosition(e.target.value)} // Update state on change
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={contact}
            onChange={(e) => setContact(e.target.value)} // Update state on change
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)} // Update state on change
          />
          <TextField
            label="Nickname"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // Update state on change
          />

          {/* Display and change Dev Tags */}
          <Box display="flex" justifyContent="space-around" mt={2}>
            {/* Light Dev Tag */}
            <label htmlFor="light-upload">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="light-upload"
                type="file"
                onChange={(e) => handleImageUpload(e, "light")}
              />
              <Card sx={{ maxWidth: 150, cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  alt="Dev Tag Light"
                  height="150"
                  image={devTagLight || "/placeholder-light.png"}
                  title="Dev Tag Light"
                />
              </Card>
            </label>

            {/* Dark Dev Tag */}
            <label htmlFor="dark-upload">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="dark-upload"
                type="file"
                onChange={(e) => handleImageUpload(e, "dark")}
              />
              <Card sx={{ maxWidth: 150, cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  alt="Dev Tag Dark"
                  height="150"
                  image={devTagDark || "/placeholder-dark.png"}
                  title="Dev Tag Dark"
                />
              </Card>
            </label>
          </Box>

          {/* Save Button */}
          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>

          {uploadProgress > 0 && (
            <Typography variant="body2" color="textSecondary">
              Upload progress: {Math.round(uploadProgress)}%
            </Typography>
          )}
        </Box>
      ) : (
        <Typography>Loading user data...</Typography>
      )}
    </Box>
  );
};

export default Settings;
