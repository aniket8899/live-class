import Session from "../model/Session.js";
import User from "../model/user.js";

export const listSession = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { status } = req.query;

        const statusFilter = status && status !== 'all' ? { status } : {};


        const session = await Session.find({
            $and: [
                statusFilter,
                {
                    $or: [
                        { host: userId },
                        { 'participants.userId': userId }
                    ]
                }
            ]
        }).sort({ createdAt: -1 });

        const result = session.map((s) => ({
            id: s._id,
            roomId: s.roomId,
            hostName: s.hostName,
            status: s.status,
            participantCount: s.participants.length || 0,
            startedAt: s.startedAt,
            endedAt: s.endedAt,
            isHost: s.host.toString() === userId.toString(),
        }));

        res.json({
            success: true,
            data: {
                session: result
            }

        })

    } catch (error) {
        next(error)

    }
};

export const createSession = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }

        //generate unique roomId

        let roomId;
        let attempts = 0;
        const maxattempts = 10;

        do {
            roomId = Session.generateRoomId();
            const exist = await Session.roomIdExists(roomId);

            if (!exist) {
                break;
            }
            attempts++;
        } while (attempts < maxattempts);

        if (attempts >= maxattempts) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate unique roomId ,please try again'
            })
        }

        const session = await Session.create({
            roomId,
            host: userId,
            hostName: user.name,
            participants: [{
                userId: userId,
                userName: user.name,
            }]
        });

        res.status(201).json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    hostName: session.hostName,
                    status: session.status,
                    participantCount: session.participants.length,
                    startedAt: session.startedAt,
                    participants: session.participants,
                }
            }
        })

    } catch (error) {
        next(error)

    }
}


export const joinSession = async (req, res, next) => {
    try {

        const { roomId } = req.body;
        const userId = req.user.userId;

        if (!roomId) return res.status(400).json({
            success: false,
            error: 'Room id required'
        })

        const session = await Session.findOne({ roomId });
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found. please check room Id'
            })
        }

        if (session.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: 'This session has ended'
            })
        }

        // check if  user already join the session
        const alreadyJoined = session.participants.some(
            p => p.userId.toString() === userId.toString()
        )

        if (alreadyJoined) {
            return res.json({
                success: true,
                data: {
                    session: {
                        id: session._id,
                        roomId: session.roomId,
                        hostName: session.hostName,
                        status: session.status,
                        participantCount: session.participants.length,
                        isHost: session.host.toString() === userId.toString(),
                        participants: session.participants,
                    }
                }
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }

        session.participants.push({
            userId: userId,
            userName: user.name
        })

        await session.save();

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    hostName: session.hostName,
                    status: session.status,
                    participantCount: session.participants.length,
                    isHost: session.host.toString() === userId.toString(),
                    participants: session.participants,
                }
            }
        })

    } catch (error) {
        next(error)
    }

}


export const getSession = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.userId;

        const session = await Session.findOne({ roomId });
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found. please check room Id'
            })
        }

        // check if  user already join the session
        const isParticipants = session.participants.some(
            p => p.userId.toString() === userId.toString()
        );

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    hostName: session.hostName,
                    status: session.status,
                    participantCount: session.participants.length,
                    isHost: session.host.toString() === userId.toString(),
                    isParticipants,
                    participants: session.participants,
                }
            }
        })

    } catch (error) {
        next(error)
    }
}

export const endSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.userId;

        const session = await Session.findById( sessionId );
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found. '
            })
        }

        // verify user host or not
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only host can end the session '
            })
        }

        // check if already ended

        if (session.status === 'ended') {
            return res.status(400).json({
                success: false,
                error: 'Session has already ended '
            })
        }

        session.status = 'ended';
        session.endedAt = new Date();
        await session.save();

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,

                    status: session.status,
                    endedAt: session.endedAt
                }
            }
        })


    } catch (error) {
        next(error)

    }

}


export const leaveSession = async (req, res, next) => {
    try {

        const { roomId } = req.body;
        const userId = req.user.userId;

        if (!roomId) return res.status(400).json({
            success: false,
            error: 'Room id required'
        })

        const session = await Session.findOne({ roomId });
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found.'
            })
        }

       session.participants= session.participants.filter(
            p => p.userId.toString() !== userId.toString()
        );

        await session.save();

        res.json({
            success:true,
            data:{
                message:'Left session successfully'
            }

        })

    } catch (error) {
        next(error)
    }
}