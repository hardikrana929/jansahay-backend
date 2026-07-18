const Scheme = require('../models/Scheme');

//Create Scheme
const createScheme = async (req, res) => {
    try {
        //Import from body
        const {
            title,
            description,
            schemeType,
            government,
            state,
            eligibleOccupations,
            eligibleCategories,
            incomeLimit,
            minAge,
            maxAge,
            disabilityRequired,
            benefits,
            documentsRequired,
            officialLink,
            applicationDeadline
        } = req.body;

        // Validate required fields
        if (!title || !description || !schemeType || !government || !benefits || !officialLink || !applicationDeadline) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check duplicate scheme
        const existingScheme = await Scheme.findOne({
            title: title.trim()
        });

        if (existingScheme) {
            return res.status(400).json({
                success: false,
                message: "Scheme already exists."
            });
        }

        // Create Scheme
        const scheme = await Scheme.create({
            title,
            description,
            schemeType,
            government,
            state,
            eligibleOccupations,
            eligibleCategories,
            incomeLimit,
            minAge,
            maxAge,
            disabilityRequired,
            benefits,
            documentsRequired,
            officialLink,
            applicationDeadline,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Scheme created successfully.",
            scheme
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//Get all schemes
const getAllSchemes = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            schemeType,
            state,
            government,
            sort = "latest"
        } = req.query;

        const query = {
            isActive: true
        };

        // Search by title
        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by scheme type
        if (schemeType) {
            query.schemeType = schemeType;
        }

        // Filter by state
        if (state) {
            query.state = state;
        }

        // Filter by government
        if (government) {
            query.government = government;
        }

        const sortOption =
            sort === "oldest"
                ? { createdAt: 1 }
                : { createdAt: -1 };

        const totalSchemes = await Scheme.countDocuments(query);

        const schemes = await Scheme.find(query)
            .populate("createdBy", "name email")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            currentPage: Number(page),
            totalPages: Math.ceil(totalSchemes / limit),
            totalSchemes,
            schemes
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

//Get One Scheme
const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id).populate("createdBy", "name email");
        if (!scheme || !scheme.isActive) {
            return res.status(404).json({
                success: false,
                message: "Scheme not found."
            })
        }

        res.status(200).json({
            success: true,
            scheme
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//Update Scheme
const updateScheme = async (req, res) => {
    try {
        const updatedScheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
        if (!updatedScheme) {
            return res.status(404).json({
                success: false,
                message: "Scheme is not Found."
            })
        }
        res.status(200).json({
            success: true,
            message: "Scheme Updated successfully.",
            scheme: updatedScheme
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//Deactive Scheme
const deactivateScheme = async (req, res) => {
    try {

        const scheme = await Scheme.findById(req.params.id).select("+isActive");

        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: "Scheme not found."
            });
        }

        scheme.isActive = !scheme.isActive;

        await scheme.save();

        res.status(200).json({
            success: true,
            message: `Scheme ${scheme.isActive ? "activated" : "deactivated"} successfully.`,
            isActive: scheme.isActive
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { createScheme, getAllSchemes, getSchemeById, updateScheme, deactivateScheme }