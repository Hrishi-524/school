import { db } from "../database/index.js";
import { getDistance } from "../utils/distance.js";

export const createSchoolsTable = async (req, res) => {
  const query = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    )
  `;

  await db.execute(query);

  res.status(201).json({ message: "Schools table created successfully" });
};

export const addSchool = async (req, res, next) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ 
            error: 'All fields are required' 
        });
    }

    if (typeof name !== 'string' ||typeof address !== 'string' ||isNaN(parseFloat(latitude)) ||isNaN(parseFloat(longitude))) {
        return res.status(400).json({ 
            error: 'Invalid data types' 
        });
    }


    const query = `
        INSERT INTO schools 
        (name, address, latitude, longitude)
        VALUES 
        (?, ?, ?, ?)`
    
    await db.execute(query, [name, address, latitude, longitude]);

    res.status(201).json({ 
        message: 'School added successfully' 
    });
};

export const listSchools = async (req, res, next) => {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    if (!userLat || !userLng) {
        return res.status(400).json({ 
            error: 'User latitude and longitude required' 
        });
    }

    if(isNaN(parseFloat(userLat)) || isNaN(parseFloat(userLng))) {
        return res.status(400).json({ 
            error: 'Invalid data types' 
        });
    }

    const [rows] = await db.execute('SELECT * FROM schools');

    const schoolsWithDistance = rows.map((school) => {
        const distance = getDistance(
                userLat,
                userLng,
                parseFloat(school.latitude),
                parseFloat(school.longitude)
        );
        return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
}