const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const apiKey = process.env.API_CLARIFAI;

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + apiKey);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: process.env.USER_ID,
        app_id: process.env.APP_ID,
      },
      model_id: 'face-detection',
      version_id: '45fb9a671625463fa646c3523a3087d5',
      inputs: [
        { data: { image: { url: req.body.input, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log('Error: ' + err);
        return res.status(400).json('unable to work with API');
      }

      if (response.status.code !== 10000) {
        console.log(
          'Received failed status: ' +
            response.status.description +
            '\n' +
            response.status.details
        );
        return res.status(400).json('unable to work with API');
      }

      res.json(response);
    }
  );
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};