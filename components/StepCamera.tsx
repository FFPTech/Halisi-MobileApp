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
import { useUser } from "../Hooks/useUserGlobal";
import CommonButton from "./CommonButtonComponent";
import FormStepWrapper from "./FormStepWrapper";

/*
  Box format from context:
  [x, y, width, height]
*/

interface StepCameraProps {
  permission: { granted: boolean };
  requestPermission: () => void;
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  cameraRef: React.RefObject<any>;
  facing: "front" | "back";
  toggleCameraFacing: () => void;
  setPhotoBase64: (base64: string | null) => void;
  onpress: () => void;
  species: "farmer" | "livestock";
  errors?: { photoUri?: string };
}

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
}: StepCameraProps) {
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  /* CONTEXT BOX */
  const { box, setBox } = useUser(); // [x, y, width, height]
  const [x0, y0, w0, h0] = box;

  /* ==========================
     BOUNDING BOX LOGIC
  =========================== */
  const MIN_SIZE = 120;
  const EDGE = 18;

  const [mode, setMode] = useState<
    null | "move" | "l" | "r" | "t" | "b" | "tl" | "tr" | "bl" | "br"
  >(null);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(v, max));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: (e) => {
      const { locationX, locationY } = e.nativeEvent;

      const l = x0;
      const r = x0 + w0;
      const t = y0;
      const b = y0 + h0;

      const nl = Math.abs(locationX - l) < EDGE;
      const nr = Math.abs(locationX - r) < EDGE;
      const nt = Math.abs(locationY - t) < EDGE;
      const nb = Math.abs(locationY - b) < EDGE;

      if (nl && nt) setMode("tl");
      else if (nr && nt) setMode("tr");
      else if (nl && nb) setMode("bl");
      else if (nr && nb) setMode("br");
      else if (nl) setMode("l");
      else if (nr) setMode("r");
      else if (nt) setMode("t");
      else if (nb) setMode("b");
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
      setBox(([x, y, width, height]) => {
        let nx = x;
        let ny = y;
        let nw = width;
        let nh = height;

        if (mode === "move") {
          nx = clamp(x + g.dx, 0, containerSize.w - width);
          ny = clamp(y + g.dy, 0, containerSize.h - height);
        }

        if (mode === "l" || mode === "tl" || mode === "bl") {
          const lx = clamp(x + g.dx, 0, x + width - MIN_SIZE);
          nw -= lx - x;
          nx = lx;
        }

        if (mode === "r" || mode === "tr" || mode === "br") {
          nw = clamp(width + g.dx, MIN_SIZE, containerSize.w - x);
        }

        if (mode === "t" || mode === "tl" || mode === "tr") {
          const ty = clamp(y + g.dy, 0, y + height - MIN_SIZE);
          nh -= ty - y;
          ny = ty;
        }

        if (mode === "b" || mode === "bl" || mode === "br") {
          nh = clamp(height + g.dy, MIN_SIZE, containerSize.h - y);
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
      if (!cameraRef.current) return;

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
      <FormStepWrapper title="Step 2: Capture User Photo">
        <CommonButton title="Grant Permission" onPress={requestPermission} />
      </FormStepWrapper>
    );
  }

  return (
    <FormStepWrapper title="Step 2: Capture User Photo">
      {photoUri ? (
        <>
          <View
            style={styles.photoWrapper}
            onLayout={(e) =>
              setContainerSize({
                w: e.nativeEvent.layout.width,
                h: e.nativeEvent.layout.height,
              })
            }
          >
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />

            <View
              {...panResponder.panHandlers}
              style={[
                styles.boundingBox,
                {
                  left: x0,
                  top: y0,
                  width: w0,
                  height: h0,
                },
              ]}
            >
              {["tl", "tr", "bl", "br"].map((k) => (
                <View
                  key={k}
                  style={[
                    styles.corner,
                    k === "tl" && { top: -8, left: -8 },
                    k === "tr" && { top: -8, right: -8 },
                    k === "bl" && { bottom: -8, left: -8 },
                    k === "br" && { bottom: -8, right: -8 },
                  ]}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.retakeText}>Retake Photo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View
            style={styles.cameraContainer}
            onLayout={(e) =>
              setContainerSize({
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
            <MaskOverlay
              species={species}
              w={containerSize.w}
              h={containerSize.h}
            />
          </View>

          {/* ✅ CAMERA BUTTONS (RESTORED) */}
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
      )}

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <CommonButton title="Enroll" onPress={onpress} />
      </View>
    </FormStepWrapper>
  );
}

/* ==========================
   MASK OVERLAY
========================== */
function MaskOverlay({ species, w, h }: any) {
  if (species === "farmer") {
    const mw = w * 0.55;
    const mh = h * 0.75;
    return (
      <View
        style={{
          position: "absolute",
          top: (h - mh) / 2,
          left: (w - mw) / 2,
          width: mw,
          height: mh,
          borderRadius: mh / 2,
          borderWidth: 4,
          borderColor: "limegreen",
        }}
      />
    );
  }
  return null;
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
  },
  corner: {
    position: "absolute",
    width: 16,
    height: 16,
    backgroundColor: "limegreen",
  },
  retakeBtn: {
    marginTop: 12,
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  retakeText: { color: "#fff", fontWeight: "600" },
});
