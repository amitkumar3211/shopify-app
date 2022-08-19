//const { Session } = require('@shopify/shopify-api/dist/auth/session/index.js');
 import { Session } from "@shopify/shopify-api/dist/auth/session/session.js";
 import  mysql  from "mysql";
// var mysql = require('mysql');



var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shopify-app"
});

connection.connect();

let domain_id = '';
export var storeCallback = async (session) => {
    try {
        // console.log(session);
        let data = session;
        //console.log(data);

const payload = {...session}
console.log('payload here ');
console.log(payload); 
        data.onlineAccessInfo = JSON.stringify(session.isOnline);
        //console.log(data.onlineAccessInfo);
        if (data.id.indexOf(`${data.shop}`) > -1) {

            domain_id = data.id;
        }

        connection.query(`INSERT INTO shops (shop_url, session_id, domain_id, access_token, state, is_online, online_access_info, scope) VALUES ('${data.shop}','${data.id}','${domain_id}','${session.accessToken}','${data.state}','${data.isOnline}','${data.onlineAccessInfo}','${data.scope}') ON DUPLICATE KEY UPDATE access_token='${data.accessToken}', state='${data.state}', session_id='${data.id}', domain_id='${domain_id}', scope='${data.scope}', online_access_info='${data.onlineAccessInfo}' `, (error, result, fields) => {
            if (error) throw error
            console.log(result);
        })
return true;

    } catch (err) {
        throw new Error(err);
    }


}

// not used yet 
export var loadCallback = async (id) => {
   console.log(`loadcallback id here ${id}`);
    try {
      

        let newsession =  new Session(id);
        console.log(`access token  here ${newsession.accessToken}`);
        let query = new Promise((resolve, rej) => {

            connection.query(`SELECT * FROM shops where session_id = '${id}' OR domain_id = '${id}' LIMIT 1`, (error, result, fields) => {

                if (error) throw error;
                newsession.shop = result[0].shop_url;
                newsession.state = result[0].state;
                newsession.scope = result[0].scope;
                newsession.isOnline = result[0].isOnline == 'true' ? true : false;
                newsession.onlineAccessInfo = result[0].onlineAccessInfo;
                newsession.accessToken = result[0].accessToken;

               // const date = new date();
               // date.setDate(date.getDate() * 1);
            //  console.log(date);
            //     session.expires = date;


                if (session.expires && typeof newsession.expires == 'string') {
                    session.expires = new Date(newsession.expires);
                }


            });
            resolve();


        });

        await query;
       // console.log(session);
        return newsession;

    } catch (err) {
        throw new Error(err);
    }
}
 // not used yet 
 export const deleteCallback = async (id) => {

    try {
        return false;
    } catch (err) {
        throw new Error(err);
    }
}

// module.exports = {
//     storeCallback,
//     loadCallback,
//     deleteCallback
// }