export const userHasRoles = (userRoles: string[], roleToCheck: string) => {
    return userRoles.includes(roleToCheck)
}