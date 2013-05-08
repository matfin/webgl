<canvas id="myglcanvas" width="500" height="500">
    <p>
        Need a browser that supports WebGL? Check out <a href="http://www.google.com/chrome" title="Google Chrome">Chrome</a>
    </p>
</canvas>
<form>
    <fieldset>
        <h2>
            Textures
        </h2>
        <label for="texture">
            Texture
        </label>
        <select name="texture">
            <option selected value="woodenfloor.png">
                Wooden Floor
            </option>
            <option value="lynsey.png">
                Lynsey
            </option>
            <option value="texture.png">
                Photo
            </option>
            <option value="iqcontent.png">
                iQContent
            </option>
            <option value="me.png">
                Me
            </option>
        </select>
    </fieldset>
    <fieldset>
        <h2>
            Blending
        </h2>
        <label for="alpha">
            Alpha
        </label>
        <input type="range" name="alpha" min="1" max="100" step="1" />
    </fieldset>
    <fieldset id="movement">
        <h2>
            Movement
        </h2>
        <label for="x_speed">
            X
        </label>
        <input type="range" name="x_speed" min="-200" max="200" step="1" />
        <label for="y_speed">
            Y
        </label>
        <input type="range" name="y_speed" min="-200" max="200" step="1" />
        <label for="y_speed">
            Zoom
        </label>
        <input type="range" name="z" min="-1000" max="-200" step="1" />
    </fieldset>
    <fieldset>
        <h2>
            Directional Light Position
        </h2>
        <label for="directional_light_x">
            X
        </label>
        <input type="range" name="directional_light_x" min="-100" max="10" step="1" />
        <label for="directional_light_y">
            Y
        </label>
        <input type="range" name="directional_light_y" min="-100" max="10" step="1" />
        <label for="directional_light_z">
            Z
        </label>
        <input type="range" name="directional_light_z" min="-100" max="10" step="1" />
    </fieldset>
    <fieldset>
        <h2>
            Directional Light Colour
        </h2>
        <label for="directional_color_r">
            R
        </label>
        <input type="range" name="directional_color_r" min="0" max="255" />
        <label for="directional_color_g">
            G
        </label>
        <input type="range" name="directional_color_g" min="0" max="255" />
        <label for="directional_color_b">
            B
        </label>
        <input type="range" name="directional_color_b" min="0" max="255" />
    </fieldset>
    <fieldset>
        <h2>
            Ambient Light Colour
        </h2>
        <label for="ambient_color_r">
            R
        </label>
        <input type="range" name="ambient_color_r" min="0" max="255" />
        <label for="ambient_color_g">
            G
        </label>
        <input type="range" name="ambient_color_g" min="0" max="255" />
        <label for="ambient_color_b">
            B
        </label>
        <input type="range" name="ambient_color_b" min="0" max="255" />
    </fieldset>
</form>