

import { useEffect } from 'react';
import { useState } from 'react';
import Data from '../../public/data/consolidated_cigars.json'

export default async function handler(req, res) {
    const cigars = await Data;
    const newCigar = req.body;
    
    

    return res.status(200).json({newCigar});

}