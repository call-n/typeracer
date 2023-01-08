import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCrXMuh8jc52nnpc4Lnvigt6d2b8Y3DNfE",
  authDomain: "xwork-70e52.firebaseapp.com",
  projectId: "xwork-70e52",
  storageBucket: "xwork-70e52.appspot.com",
  messagingSenderId: "698332787632",
  appId: "1:698332787632:web:53687e965e17f9e94e1c75"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

export {
	app as default,
	auth,
	db,
}