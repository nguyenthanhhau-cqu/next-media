"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function applyLatePenalty() {
    return __awaiter(this, void 0, void 0, function () {
        var now, posts, _i, posts_1, post, usersToUpdate, _loop_1, _a, _b, like, error_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    now = new Date();
                    console.log("Starting applyLatePenalty at ".concat(now.toISOString()));
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 10, 11, 13]);
                    // First, reset penaltyApplied for all users
                    return [4 /*yield*/, prisma.user.updateMany({
                            where: { penaltyApplied: true },
                            data: { penaltyApplied: false }
                        })];
                case 2:
                    // First, reset penaltyApplied for all users
                    _d.sent();
                    return [4 /*yield*/, prisma.post.findMany({
                            where: {
                                eventStartTime: { lte: now },
                                penaltiesApplied: false
                            },
                            include: {
                                likes: true,
                                attendances: true
                            }
                        })];
                case 3:
                    posts = _d.sent();
                    _i = 0, posts_1 = posts;
                    _d.label = 4;
                case 4:
                    if (!(_i < posts_1.length)) return [3 /*break*/, 9];
                    post = posts_1[_i];
                    if (!post.eventStartTime) {
                        console.log("Skipping post ".concat(post.id, " - no event start time"));
                        return [3 /*break*/, 8];
                    }
                    usersToUpdate = [];
                    _loop_1 = function (like) {
                        var attendance = post.attendances.find(function (a) { return a.userId === like.userId; });
                        if (!attendance) {
                            console.log("Applying penalty to user ".concat(like.userId, " for post ").concat(post.id));
                            usersToUpdate.push(like.userId);
                        }
                    };
                    for (_a = 0, _b = post.likes; _a < _b.length; _a++) {
                        like = _b[_a];
                        _loop_1(like);
                    }
                    if (!(usersToUpdate.length > 0)) return [3 /*break*/, 6];
                    // Apply penalties in a single batch operation
                    return [4 /*yield*/, prisma.user.updateMany({
                            where: { id: { in: usersToUpdate } },
                            data: {
                                balance: { decrement: (_c = post.penaltyAmount) !== null && _c !== void 0 ? _c : 0 }, // Use the custom penalty amount
                                penaltyApplied: true
                            }
                        })];
                case 5:
                    // Apply penalties in a single batch operation
                    _d.sent();
                    _d.label = 6;
                case 6: 
                // Mark penalties as applied for this post
                return [4 /*yield*/, prisma.post.update({
                        where: { id: post.id },
                        data: { penaltiesApplied: true }
                    })];
                case 7:
                    // Mark penalties as applied for this post
                    _d.sent();
                    console.log("Finished processing post ".concat(post.id));
                    _d.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9:
                    console.log('Late penalties applied successfully');
                    return [3 /*break*/, 13];
                case 10:
                    error_1 = _d.sent();
                    console.error('Error applying late penalties:', error_1);
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, prisma.$disconnect()];
                case 12:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
applyLatePenalty().catch(function (error) {
    console.error('Unhandled error in applyLatePenalty:', error);
    process.exit(1);
});
