import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useState } from "react";
import {
  Alert,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Ellipse, Mask, Rect } from "react-native-svg";
import { useUser } from "../Hooks/useUserGlobal";
import CommonButton from "./CommonButtonComponent";
import FormStepWrapper from "./FormStepWrapper";

/* ==========================
   CONSTANTS
========================== */
const HANDLE_SIZE = 18;
const HANDLE_TOUCH = 32;
const MIN_SIZE = 120;

/* ==========================
   MAIN COMPONENT
========================== */
export default function StepCamera({
  permission,
  requestPermission,
  photoUri,
  setPhotoUri,
  cameraRef,
  facing,
  toggleCameraFacing,
  setPhotoBase64,
  species,
  onpress,
}: any) {
  const [container, setContainer] = useState({ w: 0, h: 0 });
  const { box, setBox } = useUser(); // [x, y, w, h]
  const [x0, y0, w0, h0] = box;
  const [mode, setMode] = useState<null | "move" | "tl" | "br">(null);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(v, max));

  /* ==========================
     PAN RESPONDER
  =========================== */
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      const l = x0;
      const r = x0 + w0;
      const t = y0;
      const b = y0 + h0;

      const hit = (x: number, y: number) =>
        Math.abs(locationX - x) < HANDLE_TOUCH / 2 &&
        Math.abs(locationY - y) < HANDLE_TOUCH / 2;

      if (hit(l, t)) setMode("tl");
      else if (hit(r, b)) setMode("br");
      else if (
        locationX > l &&
        locationX < r &&
        locationY > t &&
        locationY < b
      ) {
        setMode("move");
      }
    },

    onPanResponderMove: (_, g) => {
      setBox(([x, y, w, h]) => {
        let nx = x,
          ny = y,
          nw = w,
          nh = h;

        if (mode === "move") {
          nx = clamp(x + g.dx, 0, container.w - w);
          ny = clamp(y + g.dy, 0, container.h - h);
        }

        if (mode === "tl") {
          const lx = clamp(x + g.dx, 0, x + w - MIN_SIZE);
          const ty = clamp(y + g.dy, 0, y + h - MIN_SIZE);
          nw -= lx - x;
          nh -= ty - y;
          nx = lx;
          ny = ty;
        }

        if (mode === "br") {
          nw = clamp(w + g.dx, MIN_SIZE, container.w - x);
          nh = clamp(h + g.dy, MIN_SIZE, container.h - y);
        }

        return [nx, ny, nw, nh];
      });
    },

    onPanResponderRelease: () => setMode(null),
  });

  /* ==========================
     CAMERA
  =========================== */
  const takePicture = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1200 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      setPhotoUri(resized.uri);
      setPhotoBase64(resized.base64 ?? null);
    } catch {
      Alert.alert("Camera error", "Failed to capture image");
    }
  };

  if (!permission.granted) {
    return (
      <FormStepWrapper title="Capture Photo">
        <CommonButton title="Grant Permission" onPress={requestPermission} />
      </FormStepWrapper>
    );
  }

  return (
    <FormStepWrapper title="Capture Photo">
      {!photoUri ? (
        <>
          <View
            style={styles.cameraContainer}
            onLayout={(e) =>
              setContainer({
                w: e.nativeEvent.layout.width,
                h: e.nativeEvent.layout.height,
              })
            }
          >
            <CameraView
              ref={cameraRef}
              style={styles.cameraBox}
              facing={facing}
              mirror
            />
            <MaskOverlay species={species} w={container.w} h={container.h} />
          </View>

          {/* ✅ CONTROL BAR (STREAM BUTTON RESTORED) */}
          <View style={styles.controlBar}>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={32} color="#2e7d32" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture}>
              <Ionicons name="camera" size={38} color="#2e7d32" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="videocam" size={32} color="#2e7d32" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.photoWrapper}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />

            <View
              {...panResponder.panHandlers}
              style={[
                styles.boundingBox,
                { left: x0, top: y0, width: w0, height: h0 },
              ]}
            >
              {/* 🔴 TOP LEFT HANDLE */}
              <View
                style={[
                  styles.handleWrapper,
                  { left: -HANDLE_TOUCH / 2, top: -HANDLE_TOUCH / 2 },
                ]}
              >
                <View style={styles.redOutlineHandle} />
              </View>

              {/* 🔴 BOTTOM RIGHT HANDLE */}
              <View
                style={[
                  styles.handleWrapper,
                  { right: -HANDLE_TOUCH / 2, bottom: -HANDLE_TOUCH / 2 },
                ]}
              >
                <View style={styles.redOutlineHandle} />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        </>
      )}

      <CommonButton title="Enroll" onPress={onpress} />
    </FormStepWrapper>
  );
}

/* ==========================
   MASK OVERLAY (OVAL)
========================== */
function MaskOverlay({ species, w, h }: any) {
  if (!w || !h || species !== "farmer") return null;

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Mask id="mask">
        <Rect width={w} height={h} fill="white" />
        <Ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w * 0.28}
          ry={h * 0.42}
          fill="black"
        />
      </Mask>
      <Rect width={w} height={h} fill="rgba(0,0,0,0.6)" mask="url(#mask)" />
      <Ellipse
        cx={w / 2}
        cy={h / 2}
        rx={w * 0.28}
        ry={h * 0.42}
        stroke="limegreen"
        strokeWidth={3}
        fill="none"
      />
    </Svg>
  );
}

/* ==========================
   STYLES
========================== */
const styles = StyleSheet.create({
  cameraContainer: { width: "100%", height: 300 },
  cameraBox: { width: "100%", height: "100%" },

  controlBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },

  photoWrapper: { width: "100%", height: 300 },
  photoPreview: { width: "100%", height: "100%" },

  boundingBox: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "limegreen",
    backgroundColor: "rgba(0,0,0,0.01)",
  },

  handleWrapper: {
    position: "absolute",
    width: HANDLE_TOUCH,
    height: HANDLE_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },

  redOutlineHandle: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "red",
  },

  retakeBtn: {
    marginTop: 12,
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  retakeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
