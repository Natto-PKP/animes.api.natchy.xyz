const flags = {
  OWNER: 1n << 0n,
  ADMINISTRATOR: 1n << 1n,
  MODERATOR: 1n << 2n,
  MEMBER: 1n << 3n,
  CREATOR: 1n << 4n,
};

export type UserPermissionType = keyof typeof flags;

export class UserPermissionsService {
  static has(keys: UserPermissionType | UserPermissionType[], bit: bigint) {
    if (Array.isArray(keys)) return keys.every((key) => (bit & flags[key]) === flags[key]);

    const prop = flags[keys];
    return (bit & prop) === prop;
  }

  static resolve(bit: bigint) {
    const result = Object.entries(flags).filter((flag) => (bit & flag[1]) === flag[1]);
    return result.map(([key]) => key);
  }

  static merge(keys: UserPermissionType[]) {
    return keys.reduce((acc, key) => acc | flags[key], 0n);
  }
}
