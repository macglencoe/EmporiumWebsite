

import Data from '../../public/data/consolidated_cigars.json'
import { withAuth } from '../../lib/auth/server.mjs';

async function handler(req, res) {
    const cigars = await Data;
    const newCigar = req.body;
    
    

    return res.status(200).json({newCigar});

}
export default withAuth(handler);
