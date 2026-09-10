import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseDb, firebaseStorage } from "./config";

export type ReferralConfig = {
  commissionPercent: number;
  referralBonus: number;
  referralCommissionPercent: number;
};

export const defaultReferralConfig: ReferralConfig = {
  commissionPercent: 5,
  referralBonus: 20,
  referralCommissionPercent: 1,
};

export function getReferralCodeFromUrl() {
  return new URLSearchParams(window.location.search).get("ref")?.trim().toUpperCase() || null;
}

export function createReferralCode() {
  return `BB${Math.floor(1000 + Math.random() * 9000)}`;
}

export function persistReferralCode(code: string | null) {
  if (code) localStorage.setItem("bb-referral-code", code);
}

export function getPersistedReferralCode() {
  return localStorage.getItem("bb-referral-code");
}

export async function getAppConfig(): Promise<ReferralConfig> {
  const snapshot = await getDoc(doc(firebaseDb, "settings", "appConfig"));
  return { ...defaultReferralConfig, ...(snapshot.exists() ? snapshot.data() : {}) } as ReferralConfig;
}

export async function ensureAppConfig() {
  const ref = doc(firebaseDb, "settings", "appConfig");
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) await setDoc(ref, defaultReferralConfig, { merge: true });
  return getAppConfig();
}

export async function createConsumerWithReferral(input: { id: string; name: string; phone: string; district?: string; referredBy?: string | null }) {
  const myReferralCode = createReferralCode();
  const consumerRef = doc(firebaseDb, "consumers", input.id);
  await setDoc(consumerRef, {
    name: input.name,
    phone: input.phone,
    district: input.district || "",
    joinedAt: serverTimestamp(),
    wishlist: [],
    myReferralCode,
    referredBy: input.referredBy || null,
    totalReferralEarning: 0,
    referralCount: 0,
  }, { merge: true });
  if (input.referredBy) {
    const referrerQuery = query(collection(firebaseDb, "consumers"), where("myReferralCode", "==", input.referredBy), limit(1));
    const referrer = await getDocs(referrerQuery);
    const referrerDoc = referrer.docs[0];
    await addDoc(collection(firebaseDb, "referrals"), {
      referrerId: referrerDoc?.id || input.referredBy,
      referrerPhone: referrerDoc?.data()?.phone || "",
      referredId: input.id,
      referredPhone: input.phone,
      status: "pending",
      earning: 0,
      createdAt: serverTimestamp(),
    });
  }
  localStorage.removeItem("bb-referral-code");
  return myReferralCode;
}

export async function completeFirstPaidReferral(referredId: string, orderTotal: number) {
  const referralsQuery = query(collection(firebaseDb, "referrals"), where("referredId", "==", referredId), where("status", "==", "pending"), limit(1));
  const snapshot = await getDocs(referralsQuery);
  const referral = snapshot.docs[0];
  if (!referral) return null;
  const config = await getAppConfig();
  const earning = config.referralBonus;
  await updateDoc(referral.ref, { status: "completed", earning, completedAt: serverTimestamp(), firstOrderTotal: orderTotal });
  await updateDoc(doc(firebaseDb, "consumers", referral.data().referrerId), { totalReferralEarning: increment(earning), referralCount: increment(1) });
  return earning;
}

export async function uploadProductPhoto(shopId: string, file: File) {
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-");
  const storageRef = ref(firebaseStorage, `shops/${shopId}/products/${Date.now()}_${safeName}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
