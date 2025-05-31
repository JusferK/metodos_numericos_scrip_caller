% newton_raphson_antoine.m

% Asume que A, B, C, y P_deseada vienen del workspace

% Punto inicial
T0 = 90;  % Grados Celsius

% Definición de la función Antoine y su derivada
antoine = @(T) A - (B ./ (C + T));
antoine_derivada = @(T) (log(10) * B .* 10.^(A - B ./ (T + C))) ./ ((T + C).^2);

% Funciones para Newton-Raphson
f = @(T) 10.^(antoine(T)) - P_deseada;
f_derivada = @(T) antoine_derivada(T);

% Parámetros de Newton-Raphson
tolerancia = 1e-6;
max_iter = 100;
T = T0;

for i = 1:max_iter
    f_val = f(T);
    f_prime = f_derivada(T);

    if f_prime == 0
        error('La derivada se volvió cero. Abortando.');
    end

    T_nueva = T - f_val / f_prime;

    if abs(T_nueva - T) < tolerancia
        break;
    end

    T = T_nueva;
end

fprintf('Temperatura de ebullición aproximada: %.4f\n', T);
