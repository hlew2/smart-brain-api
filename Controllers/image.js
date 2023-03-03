const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + 'f5cb2ab4a6ba4ed7b3a1fbab0799484e');

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: 'hvkpdw41x6wg',
        app_id: 'my-first-application',
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