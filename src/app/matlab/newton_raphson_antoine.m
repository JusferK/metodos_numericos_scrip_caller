% newton_raphson_antoine.m

fprintf('--- Iniciando cálculo de temperatura de ebullición ---\n');

fprintf('Constantes Antoine recibidas:\n');
fprintf('  A = %.5f\n', A);
fprintf('  B = %.5f\n', B);
fprintf('  C = %.5f\n', C);
fprintf('Presión deseada: %.5f mmHg\n\n', P_deseada);

% Punto inicial
T0 = 90;  % Grados Celsius
fprintf('Valor inicial T0: %.2f °C\n', T0);

% Definición de funciones
antoine = @(T) A - (B ./ (C + T));
antoine_derivada = @(T) (log(10) * B .* 10.^(A - B ./ (T + C))) ./ ((T + C).^2);

f = @(T) 10.^(antoine(T)) - P_deseada;
f_derivada = @(T) antoine_derivada(T);

% Parámetros
tolerancia = 1e-6;
max_iter = 100;
T = T0;

fprintf('Tolerancia: %.1e\n', tolerancia);
fprintf('Máximo de iteraciones: %d\n\n', max_iter);

for i = 1:max_iter
    f_val = f(T);
    f_prime = f_derivada(T);

    fprintf('[Iteración %d] T = %.6f, f(T) = %.6f, f''(T) = %.6f\n', i, T, f_val, f_prime);

    if f_prime == 0
        fprintf('La derivada se volvió cero. Abortando cálculo.\n');
        error('La derivada se volvió cero.');
    end

    T_nueva = T - f_val / f_prime;

    if abs(T_nueva - T) < tolerancia
        fprintf('Convergencia alcanzada en %d iteraciones.\n', i);
        break;
    end

    T = T_nueva;
end

fprintf('\n--- Resultado final ---\n');
fprintf('Temperatura de ebullición aproximada: %.4f °C\n', T);
