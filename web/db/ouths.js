//const { Session } = require('@shopify/shopify-api/dist/auth/session/index.js');
import { Session } from "@shopify/shopify-api/dist/auth/session/session.js";
import  mysql  from "mysql";
// var mysql = require('mysql');

const connection = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "shopifyapi",
});

connection.connect();

let domain_id = "";

export const storeCallback = async (session)=> {
 try {
   let data = session;
   data.onlineAccessInfo = JSON.stringify(session.onlineAccessInfo);

   if (data.id.indexOf(`${data.shop}`) > -1) {
     domain_id = data.id;
   }

   connection.query(
     `INSERT INTO shops (shop_url, session_id, domain_id, access_token, state, is_online, online_access_info, scope) VALUES ('${data.shop}','${data.id}','${domain_id}','${data.accessToken}', '${data.state}', '${data.isOnline}', '${data.onlineAccessInfo}', '${data.scope}') ON DUPLICATE KEY UPDATE access_token='${data.accessToken}',state='${data.state}',session_id='${data.id}',domain_id='${domain_id}',scope='${data.scope}', online_access_info='${data.onlineAccessInfo}'`,
     function (error, results, fields) {
       if (error) throw error;
     }
   );
   return true;
 } catch (error) {
   throw new Error(error);
 }
}

export var loadCallback= async (id)=> {
 try {
   let session = new Session(id);
   let query = new Promise((resolve, reject) => {
     connection.query(
       `SELECT * FROM shops WHERE session_id='${id}' OR domain_id='${id}' LIMIT 1`,
       function (error, results, fields) {
         if (error) throw error;

         session.shop = results[0].shop_url;
         session.state = results[0].state;
         session.scope = results[0].scope;
         session.isOnline = results[0].isOnline == "true" ? true : false;
         session.onlineAccessInfo = results[0].onlineAccessInfo;
         session.access_token = results[0].accessToken;

         const date = new Date();
         date.setDate(date.getDate() + 1);
         session.expires = date;

         if (session.expires && typeof session.expires == "string") {
           session.expires = new Date(session.expires);
         }
         resolve();
       }
     );
   });
   await query;
   //findSessionsByShopCallback(session.shop);
   return session;
 } catch (error) {
   throw new Error(error);
 }
}




export const deleteCallback = async (id)=> {
 try {
   return true;
 } catch (error) {
   throw new Error(error);
 }
}



/*
    The findSessionByShopCallback takes in the session.shop, and attempts to delete the session from Firestore
    If the session can be deleted, return true,
    otherwise, return false
    */
   export var findSessionsByShopCallback = async (shop) => {
        console.log(`Custom session storage findSessionsByShop fired with Shop: `, shop);

        findSessionsByShop();
        // try {
        //     const docRef = doc(db, "app-sessions",`offline_${shop}`);
        //     const docSnap = await getDoc(docRef);

        //     if (docSnap.exists()) {
        //         console.log("Document data:", docSnap.data());
        //         const session = docSnap.data();
        //         const example = await JSON.parse(JSON.stringify(session));
        //         return [ new Object({
        //             ...example,
        //             isActive: () => {
        //                 if (example?.accessToken) return true
        //             }
        //         })];
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //         return undefined;
        //     }   
        // } catch (err) {
        //     throw new Error(err);
        // }
    }

    /*
    The deleteCallback takes in the session, and attempts to delete the session from Firestore
    If the session can be deleted, return true,
    otherwise, return false
    */
   export const  deleteSessionsCallback= async (sessionIDs) => {
        console.log(`\n\n\nCustom session storage deleteCallback fired with id id`, sessionIDs);
        // try {
        //     const docRef = doc(db, "app-sessions",`${sessionIDs[0]}`);
        //     const docSnap = await getDoc(docRef);
        //     if (docSnap.exists()) {
        //         console.log("Document data:", docSnap.data());
        //         await deleteDoc(docRef);
        //         return true;
        //     } else {
        //         console.log("No such document!");
        //         return false;
        //     }   
        // } catch (err) {
        //     throw new Error(err);
        // }
    };















// module.exports = {
//  storeCallback,
//  loadCallback,
//  deleteCallback,
// };
