package com.campus.research.dto;

public class AuthResponse {
    private String message;
    private UserDto user;
    private String token;

    public AuthResponse() {}

    public AuthResponse(String message, UserDto user, String token) {
        this.message = message;
        this.user = user;
        this.token = token;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String message;
        private UserDto user;
        private String token;

        public Builder message(String message) { this.message = message; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }
        public Builder token(String token) { this.token = token; return this; }

        public AuthResponse build() {
            return new AuthResponse(message, user, token);
        }
    }

    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String department;

        public UserDto() {}

        public UserDto(Long id, String name, String email, String role, String department) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.department = department;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private Long id;
            private String name;
            private String email;
            private String role;
            private String department;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder name(String name) { this.name = name; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder role(String role) { this.role = role; return this; }
            public Builder department(String department) { this.department = department; return this; }

            public UserDto build() {
                return new UserDto(id, name, email, role, department);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
