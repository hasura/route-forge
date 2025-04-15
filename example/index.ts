import {startServer} from "../src";
import {Config} from "./fdx/fdxapi.rest.config";


startServer(Config).then(app => {
    app.listen(3000, () => console.log('Server started on http://localhost:3000'));
});