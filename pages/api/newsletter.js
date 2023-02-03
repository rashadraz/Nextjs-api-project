
import {connectDatabase,insertDocument} from '../../helpers/db-utils';

async function handler(req, res) {
	if (req.method === "POST") {
		const userEmail = req.body.email;
		if (!userEmail || !userEmail.includes("@")) {
			res.status(422).json({ message: "Invalid email address" });
			return;
		}
		let client;
		try{
			 client = await connectDatabase();
		}
		catch(e){
			res.status(500).json({ message: "Connecting To DataBase Failed"});
			return;

		}
		try{
			await insertDocument(client, 'newsletter' ,{ email: userEmail });
			client.close();
		}
		catch(e){
			res.status(500).json({ message: "Inserting To DataBase Failed"});
			return;
		}
		
		/// client.close();
		res.status(201).json({ message: "Success" });
	}
}

export default handler;
