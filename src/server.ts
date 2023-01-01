import fs from "fs";
import path from "path";

import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  //GET request: http://{{HOST}}/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/7/74/Lions_at_the_Feldherrnhalle_in_Munich.JPG
  app.get('/filteredimage', async (req, res) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res.status(400).send({ message: 'Please provide a valid image URL' });
    }
    try {
      const filteredImgPath: string = await filterImageFromURL(image_url);
      res.sendFile(filteredImgPath, async (err) => {
        if (err) {
          throw err;
        }
        const imagesDirectoryPath: string = path.join(__dirname, "/util/tmp");
        const images: string[] = fs.readdirSync(imagesDirectoryPath);
        const imagesPath: string[] = images.map(image => path.join(imagesDirectoryPath, image));
        await deleteLocalFiles(imagesPath);
      });
    } catch(err) {
      res.status(500).send({ message: "Something went wrong"});
    }
  })
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();